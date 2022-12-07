const router = require('express').Router()
const pool = require('./db');

//get all todos
router.get('/todos', async (req, res)=> {
    try {
        const alltodos = await pool.query("SELECT * FROM todo")
        if(alltodos.rows.length === 0){
            res.json({message: 'todo couldn\'t found'})
        }
        res.json(alltodos.rows)
    } catch (error) {
        res.status(500).json(error)     
    }
})
//get todo
router.get('/todos/:id', async (req, res)=> {
    try {
        const { id } = req.params
        const todoById = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id])
        if(todoById.rows.length === 0){
            res.json({message: 'todo couldn\'t found'})
        }
        res.json(todoById.rows[0])
    } catch (error) {
        res.status(500).json(error)
    }
})

//add todo
router.post('/todos', async (req, res) => {
    try {
        const { description } = req.body
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES ($1) RETURNING *", 
            [description]
        )
        res.status(200).json(newTodo["rows"][0])
    } catch (error) {
        res.status(500).json(error)
    }
})
//update todo
router.put('/todos/:id', async (req, res)=> {
    try {
        const { id } = req.params
        const { description } = req.body
        const updatedTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]
        )
        if (updatedTodo.rowCount === 0){
            return res.json({message: 'todo couldn\'t found'})
        }
        res.json({message: 'updated successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})

//delete todo
router.delete('/todos/:id', async (req, res)=> {
    try {
        const { id } = req.params
        const deletedTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])
        if (deletedTodo.rowCount === 0){
            return res.json({message: 'todo couldn\'t found'})
        }
        res.status(200).json({message: "Deleted successfully"})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router