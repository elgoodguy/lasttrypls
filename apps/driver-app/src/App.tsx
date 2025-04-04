import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@repo/ui';
import '@repo/ui/styles.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>DeliverEase - App Repartidor</h1>
      <div className="card">
        <Button 
          onClick={() => setCount((count) => count + 1)}
          variant="primary"
        >
          Contador: {count}
        </Button>
        
        <div className="button-showcase">
          <h3 className="mt-6 mb-4">Ejemplos de botones:</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="success">Aceptar Pedido</Button>
            <Button variant="destructive">Rechazar</Button>
            <Button variant="warning">En Camino</Button>
            <Button variant="secondary">Entregado</Button>
          </div>
        </div>
        
        <p className="mt-8">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
