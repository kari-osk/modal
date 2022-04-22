import { useState, useEffect } from 'react'
import { AiFillEdit, AiFillDelete, AiFillCloseCircle } from 'react-icons/ai'
import Modal from 'react-modal'
import { Table } from 'react-bootstrap'
import './styles.css'

const customStyle = {
  content: {
    width: 350,
    height: 'fit-content',
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  }
}

export default function Admin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')

  // const [displayModal, setDisplayModal] = useState(false)
  const [visibleModal, setVisibleModal] = useState(false)

  useEffect(() => {
    getProducts()
  }, [])

  //getProducts()-----------------------------------------
  async function getProducts() {
    setLoading(true)
    try {
      const data = await fetch('http://localhost:3000/api/product')
      const { products } = await data.json()
      setProducts(products)
    } catch (error) {
      alert('Erro de comunicação com o servidor.')
    }
    setLoading(false)
  }

  //newProduct()-----------------------------------------
  async function newProduct(event) {
    event.preventDefault()

    if (!title || !description || !price) {
      alert('Preencha todos os campos')
    } else {
      const body = {
        title,
        description,
        price,
        image
      }

      try {
        await fetch('http://localhost:3000/api/product', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        alert('Cadastrado com sucesso')
        clearStates()
        getProducts()
      } catch (error) {
        alert('Erro ao cadastrar o produto')
      }
    }
  }

  //editProduct()-----------------------------------------
  async function editProduct() {
    // event.preventDefault()
    try {
      const body = {
        title,
        description,
        price,
        image
      }
      await fetch('http://localhost:3000/api/product/' + id, {
        method: 'PATCH',
        body: JSON.stringify(body)
      })
      alert('Produto editado com sucesso')
      clearStates()
      getProducts()
    } catch (error) {
      alert('Erro ao editar o produto')
    }
  }

  //deleteProduct()-----------------------------------------
  async function deleteProduct(id) {
    try {
      await fetch('http://localhost:3000/api/product/' + id, {
        method: 'DELETE'
      })
    } catch (error) {
      alert('Erro ao deletar produto')
    }
  }

  //fillStates()------------------------------------------------
  function fillStates(product) {
    setId(product.id)
    setTitle(product.title)
    setDescription(product.description)
    setPrice(product.price)
    setImage(product.image)
  }

  //clearStates()------------------------------------------------
  function clearStates() {
    setTitle('')
    setDescription('')
    setPrice('')
    setImage('')
  }

  function showModal() {
    setVisibleModal(true)
  }

  //return ---------------------------------------------------
  return (
    <div>
      <h1>Lista</h1>
      <button onClick={() => showModal()}>Adicionar novo produto</button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Categoria</th>
            <th>Destino</th>
            <th>Descrição</th>
            <th>Preço</th>
          </tr>
        </thead>

        {products.map(product => (
          <>
            <tbody>
              <tr>
                <td>{product.id}</td>
                <td>{product.category}</td>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.image}</td>
                <td>
                  <AiFillEdit onClick={() => fillStates(product)} />
                </td>
                <td>
                  <AiFillDelete
                    onClick={() => {
                      const confirmBox = window.confirm(
                        'Deseja deletar o produto?'
                      )
                      if (confirmBox === true) {
                        deleteProduct(product.id)
                      }
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </>
        ))}
      </Table>

      <Modal
        style={customStyle}
        isOpen={visibleModal}
        onRequestClose={() => setVisibleModal(false)}
      >
        <form className="modal-form">
          <div>
            <AiFillCloseCircle
              className="modal-close-button"
              onClick={() => setVisibleModal(false)}
            />
            <h1>Cadastro</h1>
          </div>
          <label>
            <span>Selecione a categoria</span>
            <select>
              <option></option>
            </select>
          </label>
          <label>
            <span>Produto</span>
            <input></input>
          </label>
          <label>
            <span>Descrição</span>
            <input></input>
          </label>
          <label>
            <span>Preço</span>
            <input></input>
          </label>
          <button>Salvar</button>
          <button>Limpar</button>
        </form>
      </Modal>
    </div>
  )
}
