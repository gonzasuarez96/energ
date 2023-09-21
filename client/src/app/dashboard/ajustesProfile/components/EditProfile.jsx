"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setUserData } from "@/app/redux/actions";

// ---------------------- Toastify -------------------------//
const displaySuccessMessage = (mensaje) => {
    toast.success(mensaje, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  
  const displayFailedMessage = (mensaje) => {
    toast.error(mensaje, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  //---------------------------------------------------------------//

export default function EditProfile() {
  const user = useSelector((state) => state.user.userData);

  // Estados locales para los campos editables
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [password, setPassword] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();

  const handleInputChange = (e, field) => {
    const value = e.target.value;

    // Verificar si se ha realizado una edición
    if (value !== user[field]) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }

    // Actualizar el estado local
    switch (field) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Aquí puedes enviar los datos actualizados al servidor
    if (!isEdited) {
      setSubmitError('Debes realizar alguna modificacion.');
      return;
    }
  
    const updatedData = {
      firstName,
      lastName,
      password,
    };
  
    try {
      const response = await axios.put(`http://localhost:3001/users/${user.id}`, updatedData);
      displaySuccessMessage('Cambios guardados con exito');
      console.log('Datos actualizados: ',response)
      const userDetails = response.data;
      dispatch(setUserData(userDetails));
      console.log('Estado global actualizado user:', user.userData)
      setTimeout(() => {
        router.push("/dashboard/");
      }, 2000);
    } catch (error) {
      console.log('Error al actualizar datos: ', error);
      displayFailedMessage(error.response);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col justify-start">
      <div className="w-full">
        <div className="m-20">
          <form
            className="m-10 p-8 max-w-[70%] mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="p-4">
              <label className="block mb-2 bg-[#fcfcfc] p-2 border-l-4 border-primary-500">Nombre:</label>
              <input
                type="text"
                value={firstName}
                placeholder={firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                className="w-full px-3 py-2 text-lg rounded border"
              />
            </div>
            <div className="p-4">
              <label className="block mb-2 bg-[#fcfcfc] p-2 border-l-4 border-primary-500">Apellido:</label>
              <input
                type="text"
                value={lastName}
                placeholder={lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
                className="w-full px-3 py-2 text-lg rounded border"
              />
            </div>
            <div className="p-4">
              <label className="block mb-2 bg-[#fcfcfc] p-2 border-l-4 border-primary-500">Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange(e, "password")}
                className="w-full px-3 py-2 text-lg rounded border"
              />
            </div>
            <div className="p-4 flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-[#191654] rounded hover:bg-secondary-600 transition duration-300"
            >
              Guardar Cambios
            </button>
            </div>
            {submitError && (
            <div className="flex justify-center text-danger mt-2 mb-2">
              {submitError}
            </div>
          )}
          </form>
        </div>
      </div>
      <ToastContainer style={{ marginTop: "100px" }} />
    </div>
  );
}