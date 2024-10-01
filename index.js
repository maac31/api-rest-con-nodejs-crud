import express from 'express';
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

//me permite leer el archivo .json al cual denominamos data y donde almacenamos la info de los libros
const readData = (data) => {
    //dado el caso no encuentre el archivo este try me permie visualizar el error pero no generar un problema al momento de ejecutar el codigo
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (e) { console.log(e) }
}

//me permite escribir el archivo .json con la nueva informacion

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (e) {
        console.log(e)
    }
}

app.get('/', (req, res) => {
    res.send('api con rest para jose!!');
});

app.get('/books', (req, res) => {
    const data = readData();
    res.json(data.books);
});

app.get('/books/:id', (req, res) =>{
    const data = readData();
    const id = parseInt(req.params.id);
    // con esta constante encontramos el libro que solicitemos mediante la id 
    const book = data.books.find((book) => book.id === id)
    res.json(book);
});

app.post('/books', (req, res) => {
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.books.length + 1,
        ...body,
    }
    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
});

app.put('/books/:id', (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const index = data.books.findIndex((book) => book.id === id);
    data.books[index]={
        ...data.books[index],
        ...body,
    };
    writeData(data);
    res.json({message: "actualizaste el libro"});
}), 


app.delete('/books/:id', (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const index = data.books.findIndex((book) => book.id === id);
    data.books.splice(index, 1);
    data.books = data.books.map((book, i) => {
        return {
            ...book,
            id: i + 1 // Asignar un nuevo ID secuencial
        };
    });
    writeData(data);
    res.json({message: "eliminaste el libro"});
 
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});	
