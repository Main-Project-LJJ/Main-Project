from flask import Flask , jsonify , request
from pymongo import MongoClient
from flask_cors import CORS
import random


app = Flask(__name__)
CORS(app, origins='*')

l=["Apologies, it seems I don't have the information you're looking for. Is there something else I can help you with?",
   "I'm sorry, but I couldn't find a specific answer to your request. Can I assist you with anything else?",
   "I'm constantly learning, but I might not have the most up-to-date information on certain topics. Is there anything else I can check for you?",
   "Learning is an ongoing process for me. If there's something I can't address, I appreciate your understanding as I strive to get better. How else may I assist you?"]

client = MongoClient('mongodb://localhost:27017')
db=client.Tiruchengode
collection=db.ksrEng

db1=client.Administor
coll=db1.query
coll1=db1.login

@app.route('/admin',methods=['POST'])
def admin():
    req=request.json
    query=req.get('query','')
    res=[]
    if query== "all":
        res=list(coll.find({}, {'_id': 0}))
    elif query == "ans":
        res=list(coll.find({'key':'answered'}, {'_id': 0}))
    elif query == "nAns": 
        res=list(coll.find({'key':'not answered'}, {'_id': 0}))
    return jsonify(res)

@app.route('/login',methods=['POST'])
def login():

    try:
        req=request.json
        name=req.get('name','')
        password=req.get('password','')
        res=coll1.find_one({'name':name})

        if res :
            if res.get('pass', '') == password : return jsonify({'data':'ok'})
            else : return jsonify({'data':'wrong pass'})
        
        else : return jsonify({'data':'wrong user'})

    except Exception as e :
        print("Exception",e)
        return jsonify({"error":"invalid query"}),500
    
@app.route('/chat',methods=['POST'])
def chat():

    try:
        req=request.json
        query=req.get('query','').lower()

        if query :
            words = query.split()
            queries = [
                {'key': {'$in': [' '.join(words[i:i+n]) for i in range(len(words)-n+1)]}}
                for n in range(1, len(words) + 1)
            ]

            req_query = {'$or':queries}
            
            res=list(collection.find(req_query))

            if res:
                find = req.get('query','')

                if not coll.find_one({'query':find}):

                    data={
                        "key":"answered",
                        "query":find
                    }

                    coll.insert_one(data)

                for item in res:
                    item['_id'] = str(item['_id'])
            
                return jsonify({"data":res})
            else:
                find = req.get('query','')
                if not coll.find_one({'query':find}):

                    data={
                        "key":"answered",
                        "query":find
                    }

                    coll.insert_one(data)

                return jsonify({"data":[{'res':{'c0':random.choice(l)}}]})
            
        else :
            return jsonify({"error":"invalid query"}),400
        
    except Exception as e :
        print("Exception",e)
        return jsonify({"error":"invalid query"}),500
    

@app.route('/')
def index():
    return jsonify("server is running")

if __name__ == '__main__':
    app.run(debug=True)
