# coding=utf-8
from models import *
import datetime

class demo_data:
    def get_demo_data(self):
        expense_list = []
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180120','%Y%m%d'),
                                    g_description='Watched Captain Marvel',
                                    g_cost=200))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180202','%Y%m%d'),
                                    g_description='Bought School Materials',
                                    g_cost=50))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180301','%Y%m%d'),
                                    g_description='Dinner at KFC',
                                    g_cost=100))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180408','%Y%m%d'),
                                    g_description='Bought Laptop',
                                    g_cost=4000))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180509','%Y%m%d'),
                                    g_description='Bought PC Upgrades',
                                    g_cost=900))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180619','%Y%m%d'),
                                    g_description='Bought School Materials',
                                    g_cost=100))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180721','%Y%m%d'),
                                    g_description='Vacation Trip',
                                    g_cost=1000))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180619','%Y%m%d'),
                                    g_description='Bought School Materials',
                                    g_cost=100))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180820','%Y%m%d'),
                                    g_description='Lunch at Pizza Hut',
                                    g_cost=300))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180928','%Y%m%d'),
                                    g_description='Bought Repair Tools',
                                    g_cost=100))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20180930','%Y%m%d'),
                                    g_description='Dinner at McDonalds',
                                    g_cost=300))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20181012','%Y%m%d'),
                                    g_description='Rush Shopping',
                                    g_cost=8000))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20181013','%Y%m%d'),
                                    g_description='Lunch at Starbucks',
                                    g_cost=800))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20181114','%Y%m%d'),
                                    g_description='Birthday Treat',
                                    g_cost=300))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20181115','%Y%m%d'),
                                    g_description='Bought PS4 Controller',
                                    g_cost=50))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20181116','%Y%m%d'),
                                    g_description='Watched Avengers',
                                    g_cost=10))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20181217','%Y%m%d'),
                                    g_description='Dinner at Buffet 101',
                                    g_cost=1000))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20190510','%Y%m%d'),
                                    g_description='Impluse Buying',
                                    g_cost=500))
        expense_list.append(expenses(g_user_id=0,
                                    g_date=datetime.datetime.strptime('20190608','%Y%m%d'),
                                    g_description='PC Upgrades',
                                    g_cost=1000))
        return expense_list
