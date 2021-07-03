from flask import Flask
from jotform import *
from presidio_analyzer import AnalyzerEngine
import pandas as pd
import re
import html
import json

app = Flask(__name__)

API_KEY = '#######################'  # todo


def filter_entity(pair):
    print(pair['score'])
    if pair['type'] == 'DATE_TIME':
        if pair['score'] != 0.95:
            return False
        else:
            return True
    else:
        return True


class UIIAnalyzer:
    def __init__(self):
        self.analyzer = AnalyzerEngine()
        self.entities = ['DATE_TIME', 'EMAIL_ADDRESS', 'DOMAIN_NAME', 'US_DRIVER_LICENSE', 'NRP', 'US_PASSPORT', 'US_SSN', 'US_BANK_NUMBER', 'UK_NHS', 'PHONE_NUMBER', 'IP_ADDRESS', 'IBAN_CODE', 'CREDIT_CARD', 'US_ITIN']
        self.lang = 'en'
        self.jotformAPI = JotformAPIClient(API_KEY)
        self.html_regex = re.compile('<\/?[^>]*>')
        self.url_regex = re.compile('\w+:\/{2}[\d\w-]+(\.[\d\w-]+)*(?:(?:\/[^\s/]*))*')
        self.trans_table = str.maketrans('', '', '[]^_`{|}~')
        self.punc_regex = re.compile('([.?,/#!$%^&*;:{}=_`~()-])[.,?/#!$%^&*;:{}=_`~()-]+')

    def analyze_all(self, df):
        if df is None:
            return None

        entities = []
        for row in df.itertuples():
            analyzer_results = self.analyzer.analyze(text=row.sentence, entities=self.entities, language=self.lang)
            cur_results = {'text': row.sentence, 'results': analyzer_results}

            entities = []
            for entity in cur_results['results']:
                entity_dict = {'type': entity.entity_type, 'substr': cur_results['text'][entity.start:entity.end],
                               'score': entity.score}
                if filter_entity(entity_dict):
                    entities.append(entity_dict)

        return entities

    def clean_text(self, x):
        x = re.sub(self.html_regex, '', x)
        x = re.sub(self.url_regex, '', x)
        x = ' '.join(x.split())
        x = html.unescape(x)
        x = ''.join(word for word in x if word.isprintable())
        x = x.translate(self.trans_table)
        x = re.sub(self.punc_regex, '', x)
        x = ' '.join(x.split())
        return x

    def preprocess_form(self, form_id):
        questions = {}
        try:
            questions = self.jotformAPI.get_form_questions(form_id)
        except Exception as e:
            print(e)
            print("JotformAPI failed!")
            return None
        if not questions:
            return None
        df_json = pd.json_normalize(questions)
        df_json.columns = df_json.columns.str.lower()
        old_cols = df_json.columns
        df_json = df_json.filter(regex='(\.text$|\.description$)')
        for colname in df_json:
            test_str = colname[:-5] + '.src'
            if test_str in old_cols:
                df_json.drop([colname], axis=1, inplace=True)
        df_json['sentence'] = pd.Series(df_json.fillna('').values.tolist()).str.join('. ')
        df_json['id'] = form_id
        df_json = df_json.loc[:, ['id', 'sentence']]
        df_json['sentence'].apply(self.clean_text)
        return df_json

    def predict(self, form_id):
        return self.analyze_all(self.preprocess_form(form_id))


analyzer = UIIAnalyzer()


@app.route('/predict/<form_id>', methods=['GET'])
def index(form_id):
    return json.dumps(analyzer.predict(form_id))


if __name__ == "__main__":
    app.run(port=5000, debug=True)
