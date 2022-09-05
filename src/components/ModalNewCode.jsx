import { Fragment, useState, useEffect } from 'react'
import { Input, Button } from '../../mui/index'
import { Dialog, Transition } from '@headlessui/react'
import Swal from 'sweetalert2'
import { useSWRConfig  } from 'swr'
import { useUser } from '@auth0/nextjs-auth0'

const BaserURL = process.env.NEXT_PUBLIC_API

export default function ModalNewCode ({ onClose, isOpen }) {

  const { user } = useUser()
  const [descripcion, setDescripcion] = useState('')
  const [umed, setUmed] = useState('')
  const [alterno, setAltEnro] = useState('')
  const [erros, setErrors] = useState({})

  const { mutate } = useSWRConfig ()
  const fetchReserva = async(data) => {
    return fetch(`${BaserURL}/mcbetty/codigo100`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      return res.message
    })    
  }

  useEffect(() => {
    return () => {
      setErrors({})
      setDescripcion('')
      setUmed('')
      setAltEnro('')
    }
  }, [isOpen])
  
  const isValid = () => {
    if (alterno.trim() === '') {
      setErrors({ alterno: 'El campo es obligatorio' })
      return false
    }

    if (descripcion.trim() === '') {
      setErrors({ descripcion: 'El campo es obligatorio' })
      return false
    }

    if (umed.trim() === '') {
      setErrors({ umed: 'El campo es obligatorio' })
      return false
    }

    return true
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (!isValid()) {
      return
    }
    const data = {
      // codigo,
      AUTOR: user.name,
      DESCRIPCION: descripcion,
      UMED: umed,
      ALTERNO: alterno
    }
    const msn = await fetchReserva(data)    
    if (msn?.CODIGO) {
      Swal.fire({
        title: msn?.CODIGO,
        text: "Código creado correctamente",
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          onClose();
          mutate('/api/getProductos?skip=40')
        }
      })
    }    
  }

  
  return (
    <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-2xl font-medium leading-6 text-gray-900 text-center"
              >
                Crear nuevo código
              </Dialog.Title>
              <div className="p-5">
                <form className="flex flex-col" onSubmit={handleSubmit}>
                  <Input
                      id="code"
                      placeholder="Código alterno de adminpaq"
                      helperLabelText="Código alterno"
                      value={alterno}
                      onChange={(e) => setAltEnro(e.target.value)}
                    />
                  {erros.alterno && <p className="text-red-500 text-xs italic">{erros.alterno}</p>}
                  <span className="h-[1.2rem]"></span>
                  <Input
                      id="desc"
                      placeholder="Descripción detallada del producto"
                      helperLabelText="Descripción"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                    />
                  {erros.descripcion && <p className="text-red-500 text-xs italic">{erros.descripcion}</p>}
                  <span className="h-[1.2rem]"></span>
                  <Input
                      id="unit"
                      placeholder="Metro, kilogramo, etc."
                      helperLabelText="Unidad de medida"
                      value={umed}
                      onChange={(e) => setUmed(e.target.value)}
                    />
                  {erros.umed && <p className="text-red-500 text-xs italic">{erros.umed}</p>}
                  <span className="h-[1.2rem]"></span>
                  <div className="w-full bg-gray-300 flex gap-1">
                    <Button type="submit">
                      Generar código
                    </Button>
                    <Button color="red" type="button" onClick={onClose}>
                      Cerrar
                    </Button>
                  </div>
                </form>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
  )
}
