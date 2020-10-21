# coding=utf-8
'''
@Author John Thomas Carlos
Copyright © 2019
'''
from flask_sqlalchemy import SQLAlchemy
from config import Configuration as conf

db = SQLAlchemy()

# Sensor
class aduinnosensor(db.Model):
    __tablename__ = "aduinno"
    id = db.Column('sensor_id', db.Integer, primary_key=True)
    sensor = db.Column('sensor_value', db.Text)

    def __init__(self, g_sensor_value):
        self.sensor = g_sensor_value

# user class table
class user(db.Model):
    __tablename__ = conf.USER_TABLE
    id = db.Column('user_id', db.Integer, primary_key=True)
    username = db.Column('user_username', db.Text)
    password = db.Column('user_password', db.Text)
    email = db.Column('user_email', db.Text)
    currency = db.Column('user_currency', db.Text)

    def __init__(self, g_username, g_password, g_email):
        self.username = g_username
        self.password = g_password
        self.email = g_email
        self.currency = '$'

class expenses(db.Model):
    __tablename__ = conf.EXPENSE_TABLE
    id = db.Column('expense_id', db.Integer, primary_key=True)
    user_id = db.Column('expense_user_id', db.Integer)
    date = db.Column('expense_date', db.Date)
    description = db.Column('expense_description', db.Text)
    cost = db.Column('expense_cost', db.BigInteger)
    search_key = db.Column('expense_search_key', db.Text)

    def __init__(self, g_user_id, g_date, g_description, g_cost):
        self.user_id = g_user_id
        self.date = g_date
        self.description = g_description
        self.cost = g_cost
        self.search_key = str(g_user_id) + str(g_date) + str(g_description) + str(g_cost)
