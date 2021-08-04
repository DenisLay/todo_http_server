const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');
const todos = require('./todos.json');

function appendTodo(todo) {
    if (todos.length > 0) {
        let newId = todos[todos.length - 1].id + 1;
        todo.id = newId;
    }
    todos.push(todo);
}

http.createServer((req, res) => {
    console.log('server is work');
    if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let params = parse(body);
            let todo = {
                id: 0,
                todo: params.todo
            };
            appendTodo(todo);
            fs.writeFile('todos.json', JSON.stringify(todos), err => {
                if (err) console.log(err);
            })
            res.end('200');
        });
    }
    else if (req.method === 'GET') {
        let urlRequest = url.parse(req.url, true);
        let id = urlRequest.query.id;
        let resultTodo = 'null';
        todos.map(todo => {
           if (id == Number(todo.id)) {
               resultTodo = todo.todo;
            }
        });
        res.end(resultTodo);
    }
}).listen(3000);
