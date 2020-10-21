# coding=utf-8
'''
@Author John Thomas Carlos
Copyright © 2019
'''
from flask import Flask, jsonify, request, render_template
from models import *
from flask_cors import CORS
from config import Configuration as conf
from werkzeug.security import generate_password_hash, check_password_hash
import re
import datetime
import jwt
import base64

import click
import init_db
from flask.cli import FlaskGroup

class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        variable_start_string='[[',  # Default is '{{', I'm changing this because Vue.js uses '{{' / '}}'
        variable_end_string=']]',
    ))


app = CustomFlask(__name__)
#app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = conf.DATABASE_URI_PYTHONANYWHERE
app.config['SECRET_KEY'] = conf.SECRET_KEY
app.config['SQLALCHEMY_POOL_RECYCLE'] = 90
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 20

db.init_app(app)
CORS(app)

# index page
@app.route('/', methods=['GET'])
def test_page():
    return render_template('index.html')

# login page
@app.route('/loginsignup', methods=['GET'])
def loginsignup():
    return render_template('loginpage.html')

# Login function
@app.route('/login_user', methods=['GET'])
def login_user():
    auth = request.authorization
    find_account = user.query.filter(user.username == auth.username).first()
    if find_account:
        if auth and auth.username == find_account.username and check_password_hash(find_account.password, auth.password):
            token = jwt.encode({'id':find_account.id, 'username':find_account.username, 'email':find_account.email, 'currency':find_account.currency, 'exp':datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
            return jsonify({'status':'200','token':token.decode('UTF-8')})
        else:
            return '401'
    else:
        return '401'

# Search Expenses
@app.route('/search_expense', methods=['GET'])
def search_expense():
    counter = 0
    searched_exp = {}
    keyword = request.args.get('key')
    user_id = request.args.get('id')
    keyword = "%" + str(keyword) + "%"
    searched_expenses = expenses.query.filter(db.and_(expenses.user_id == user_id, expenses.search_key.like(keyword))).all()

    for exp in searched_expenses:
        counter += 1
        searched_exp[exp.id] = {
            'date': exp.date.strftime('%B-%d-%Y'),
            'description': exp.description,
            'cost': exp.cost,
            'exp_id': exp.id}

    if searched_expenses:
        return jsonify({'status':'200', 'expenses':searched_exp, 'num_of_exp':counter})
    elif not searched_expenses:
        return jsonify({'status':'404', 'expenses':searched_exp, 'num_of_exp':0})

# Update Expense
@app.route('/update_expense', methods=['POST'])
def update_event():
    payload = request.get_json()
    try:
        s_date = datetime.datetime.strptime(payload.get('update_date', None), '%B-%d-%Y')
    except:
        return jsonify({'code':"406", 'message': "date"})
    s_desc = payload.get('update_desc', None)
    try:
        s_cost = payload.get('update_cost', None)
        s_cost = float(s_cost)
    except:
        return jsonify({'code':"406", 'message': "cost"})
    sent_id = payload.get('update_id', None)

    expense = expenses.query.get(sent_id)
    expense.date = s_date
    expense.description = s_desc
    expense.cost = s_cost
    expense.search_key = str(sent_id) + str(s_date) + str(s_desc) + str(s_cost)

    db.session.commit()
    return jsonify({'code':"200", 'message': "updated"})

# Update User Details
@app.route('/update_user', methods=['POST'])
def update_user():
    payload = request.get_json()
    update_choice = payload.get('choice', None)
    s_username = payload.get('sent_username', None)
    s_currency = payload.get('sent_currency', None)
    s_new_pass = payload.get('sent_new_pass', None)
    s_current_pass = payload.get('sent_current_pass', None)
    s_email = payload.get('sent_email', None)
    id = payload.get('sent_id', None)

    current_user = user.query.get(id)

    if update_choice == 1:
        current_user.username = s_username
    elif update_choice == 2:
        current_user.currency = s_currency
    elif update_choice == 3:
        if check_password_hash(current_user.password, s_current_pass):
            current_user.password = generate_password_hash(s_new_pass)
        else:
            return '412'
    elif update_choice == 4:
        current_user.email = s_email;

    db.session.commit()
    return "200"


# Get User account details
def get_user_details(sent_id):
    # General Counters
    user_recent_expenses = {}
    recent_report_indicators = []
    user_all_expense = {}
    report_is_empty = True

    # Month Counters
    user_monthly_expenses = []
    user_monthly_exp = {}
    user_monthly_date = {}
    month_indicators = []
    month_dateset = []
    monthly_average = 0
    is_first_year = True

    # Year counters
    user_yearly_exp = {}
    user_year_counters = []
    year_labels = []
    year_data = []
    year_indicators = []
    year_dataset = {}
    user_yearly_expenses = {}
    yearly_average = 0

    user_statistics = {}
    user_statistics['monthly_stats'] = {}
    user_statistics['yearly_stats'] = {}

    # Default Non-Login query
    # Query home details such as recent reports and all reports
    recent_expenses = expenses.query.filter(expenses.user_id == sent_id).order_by(expenses.date.desc()).limit(8)
    all_expenses = expenses.query.filter(expenses.user_id == sent_id).all()
    for exp in recent_expenses:
        if exp.cost > 500 and exp.cost <= 1000:
            recent_report_indicators.append('#FFA041')
        elif exp.cost <= 500:
            recent_report_indicators.append('#6CD264')
        elif exp.cost > 1000:
            recent_report_indicators.append('#D44F4F')
        user_recent_expenses[exp.id] = {
            'date': exp.date.strftime('%B-%d-%Y'),
            'description': exp.description,
            'cost': exp.cost }
    for exp in all_expenses:
        user_all_expense[exp.id] = {
            'date': exp.date.strftime('%B-%d-%Y'),
            'description': exp.description,
            'cost': exp.cost,
            'exp_id': exp.id}
        year = str(exp.date.strftime('%B-%d-%Y').split('-')[2])
        if year not in user_year_counters:
            user_year_counters.append(year)

    # Reverse indicator list
    recent_report_indicators = recent_report_indicators[::-1]

    # Query monthly expenses
    for year in user_year_counters:
        user_monthly_expenses = [0,0,0,0,0,0,0,0,0,0,0,0]
        for month_counter in range(1, 12 + 1):
            monthly_expenses = expenses.query.filter(db.and_(db.func.extract('month', expenses.date) == month_counter, expenses.user_id == sent_id, db.func.extract('year', expenses.date) == year)).all()
            for exp in monthly_expenses:
                user_monthly_expenses[month_counter - 1] += exp.cost
        user_monthly_exp[year] = user_monthly_expenses
    # Get curent average monthly expenses
    current_year = datetime.datetime.now().year
    months = expenses.query.filter(db.and_(db.func.extract('year', expenses.date) == current_year, expenses.user_id == sent_id)).all()
    for month in months:
        monthly_average += month.cost
    monthly_average = round(monthly_average / 12, 2)
    # Package into object for chart JS
    for key, val in user_monthly_exp.items():
        month_indicators = []
        for v in val:
            if v > 500 and v <= 1000:
                month_indicators.append('#FFA041')
            elif v <= 500:
                month_indicators.append('#6CD264')
            elif v > 1000:
                month_indicators.append('#D44F4F')
        if is_first_year and len(user_monthly_exp) > 1:
            hide_dataset = True
            is_first_year = False
        else:
            hide_dataset = False
        month_dateset.append({'data':val, 'label':key, 'backgroundColor':month_indicators, 'hidden':hide_dataset})

    # Query yearly expenses
    for year in user_year_counters:
        yearly_expenses = expenses.query.filter(db.and_(db.func.extract('year', expenses.date) == year, expenses.user_id == sent_id)).all()
        for exp in yearly_expenses:
            if year in user_yearly_exp:
                user_yearly_exp[year] += exp.cost
            else:
                user_yearly_exp[year] = exp.cost
    # Get average yearly expenses
    for val in user_yearly_exp.values():
        yearly_average += val
    if len(user_year_counters):
        yearly_average = round(yearly_average / len(user_year_counters), 2)
    # Package into object for chart JS
    for key, val in user_yearly_exp.items():
        year_labels.append(key)
        year_data.append(val)
        if val > 10000 and val <= 20000:
            year_indicators.append('#FFA041')
        elif val <= 10000:
            year_indicators.append('#6CD264')
        elif val > 20000:
            year_indicators.append('#D44F4F')
    year_dataset = {'data':year_data, 'label':'Yearly Expenses', 'backgroundColor': year_indicators}
    user_yearly_expenses = {'label':year_labels, 'dataset':year_dataset, 'average_y':yearly_average, 'average_m':monthly_average}

    # Package statistics
    user_statistics['monthly_stats'] = month_dateset
    user_statistics['yearly_stats'] = user_yearly_expenses

    # Check if list is empty
    if all_expenses:
        report_is_empty = False

    if sent_id == 0:
        return jsonify({'status':'401', 'recent_expenses':user_recent_expenses, 'all_expenses': user_all_expense, 'user_statistics':user_statistics, 'report_is_empty':report_is_empty, 'recent_report_indicators':recent_report_indicators})
    else:
        return {'status':'200', 'recent_expenses':user_recent_expenses, 'all_expenses': user_all_expense, 'user_statistics':user_statistics, 'report_is_empty':report_is_empty, 'recent_report_indicators':recent_report_indicators}

# Check token
@app.route('/check_token', methods=['POST', 'GET'])
def check_token():
    token = None
    id = int()
    user_data = {}

    if 'access-control' in request.headers:
        token = request.headers['access-control']
    if not token:
        id = 0
        return get_user_details(0)
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'])
        id = data['id']
        user_data = get_user_details(id)
        user_data['username'] = data['username']
        user_data['id'] = data['id']
        user_data['currency'] = data['currency']
        user_data['email'] = data['email']
        return jsonify(user_data)
    except:
        id = 0
        return get_user_details(0)

# Get specified expense
@app.route('/delete_expense', methods=['POST'])
def get_specified_expense():
    payload = request.get_json()
    sent_id = payload.get('sent_id', None)
    exp = expenses.query.filter(expenses.id == sent_id).first()
    db.session.delete(exp)
    db.session.commit()
    return "200"

# Create new expense
@app.route('/new_expense', methods=['POST'])
def new_expense():
    payload = request.get_json()
    s_user = payload.get('sent_user', None)
    s_date = datetime.datetime.strptime(payload.get('sent_date', None), '%m-%d-%Y')
    s_desc = payload.get('sent_desc', None)
    s_cost = payload.get('sent_cost', None)

    new_exp = expenses(g_user_id = s_user,
                       g_date = s_date,
                       g_description = s_desc,
                       g_cost = s_cost)
    db.session.add(new_exp)
    db.session.commit()
    return "200"



# Register function
@app.route('/register_user', methods=['POST'])
def register_user():
    payload = request.get_json()
    sent_username = payload.get('sent_user', None)
    sent_password = payload.get('sent_pass', None)
    sent_email = payload.get('sent_email', None)

    if re.search(r'(\w+)[@](\w+)[.](\w+)', sent_email):
        isNotAvailable = user.query.filter(user.email == sent_email).all()
        if isNotAvailable:
            return '409'
        else:
            new_user = user(g_username = sent_username,
                            g_password = generate_password_hash(sent_password),
                            g_email = sent_email)
            db.session.add(new_user)
            db.session.commit()
            return '200'
        return '200'
    else:
        return '400'

# General Routines
@click.group(cls=FlaskGroup, create_app=lambda: app)
def cli():
    """Management script for the flask application."""

# Initialize database and db content
@cli.command('init_db')
def init_db_func():
    # Initialize tables
    db.create_all()

    # Fetch data from init_db
    dd = init_db.demo_data()
    db_data = dd.get_demo_data()

    # Insert and commit data in database
    for expense in db_data:
        db.session.add(expense)

    db.session.commit()
    print("\n --------------------------\n")
    print(" * Expense demo data registered to database")
    print("\n --------------------------\n")

@cli.command('drop_db')
def delete_db():
    with app.app_context():
        db.drop_all()
    print("\n --------------------------\n")
    print(" * Database connection teared down")
    print("\n --------------------------\n")

if __name__ == "__main__":
    cli()
