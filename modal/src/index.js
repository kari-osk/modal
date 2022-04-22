import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Server, Model } from 'miragejs'

new Server({
  models: {
    product: Model
  },
  seeds(server) {
    server.create('product', {
      id: 1,
      category: 'Cultural',
      title: 'Amsterdam',
      description: 'beautiful destination',
      price: 4545
    })
    server.create('product', {
      id: 2,
      category: 'Historical',
      title: 'Prague',
      description: 'beautiful destination',
      price: 4325
    })
    server.create('product', {
      id: 3,
      category: 'Gastronomic',
      title: 'Switzeland',
      description: 'beautiful destination',
      price: 7851
    })
    server.create('product', {
      id: 4,
      category: 'Urban',
      title: 'London',
      description: 'beautiful destination',
      price: 10545
    })
  },
  routes() {
    this.namespace = 'api'
    this.timing = 50

    this.get('/product', schema => {
      return schema.products.all()
    })
    this.post('/product', (schema, request) => {
      const attrs = JSON.parse(request.requestBody)
      return schema.products.create(attrs)
    })
    this.patch('product/:id', (schema, request) => {
      let id = request.params.id
      let product = JSON.parse(request.requestBody)
      return schema.db.products.update(id, product)
    })
    this.delete('/product/:id', (schema, request) => {
      let id = request.params.id
      return schema.todos.find(id).destroy()
    })
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
