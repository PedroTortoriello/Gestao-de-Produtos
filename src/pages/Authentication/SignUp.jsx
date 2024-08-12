import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from './api';
import Logo from './Logo.png'; // Substitua pelo caminho correto para a imagem
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterUserFormSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
  taxNumber: z.string().nonempty({ message: "CPF ou CNPJ é obrigatório" }),
  mail: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().nonempty({ message: "Telefone é obrigatório" }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterUserFormSchema),
  });

  const registerUser = async (data) => {
    setLoading(true);

    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Enviar os dados para o back-end
      const response = await api.post("/api/auth/register", {
        name: data.name,
        taxNumber: data.taxNumber,
        mail: data.mail,
        phone: data.phone,
        password: data.password,
      }, headers);

      toast.success('Usuário registrado com sucesso!');
      console.log("Usuário registrado com sucesso:", response.data);

    } catch (error) {
      toast.error('Erro ao registrar. Tente novamente.');
      setError("Erro ao registrar. Tente novamente.");
      setTimeout(() => setError(""), 2100);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="register-page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1f2a3c, #0b0e11)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#fff"
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />

      <div
        className="register-form"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          backgroundColor: "#2a2f3a",
          borderRadius: "10px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          animation: "fadeIn 0.5s ease-in-out"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <img src={Logo} alt="Logo" style={{ maxWidth: "60%", height: "auto" }} />
        </div>
        <form onSubmit={handleSubmit(registerUser)} style={{ display: "flex", flexDirection: "column" }}>
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="name" style={{ color: "#A0AEC0", marginBottom: "0.5rem" }}>Nome</label>
            <input
              id="name"
              type="text"
              {...register("name")}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #3a3f4a",
                backgroundColor: "#3a3f4a",
                color: "#fff",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#00BFFF"}
              onBlur={(e) => e.target.style.borderColor = "#3a3f4a"}
            />
            {errors.name && <p style={{ color: "#F56565", marginTop: "0.5rem" }}>{errors.name.message}</p>}
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="taxNumber" style={{ color: "#A0AEC0", marginBottom: "0.5rem" }}>CPF ou CNPJ</label>
            <input
              id="taxNumber"
              type="text"
              {...register("taxNumber")}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #3a3f4a",
                backgroundColor: "#3a3f4a",
                color: "#fff",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#00BFFF"}
              onBlur={(e) => e.target.style.borderColor = "#3a3f4a"}
            />
            {errors.taxNumber && <p style={{ color: "#F56565", marginTop: "0.5rem" }}>{errors.taxNumber.message}</p>}
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="mail" style={{ color: "#A0AEC0", marginBottom: "0.5rem" }}>E-mail</label>
            <input
              id="mail"
              type="email"
              {...register("mail")}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #3a3f4a",
                backgroundColor: "#3a3f4a",
                color: "#fff",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#00BFFF"}
              onBlur={(e) => e.target.style.borderColor = "#3a3f4a"}
            />
            {errors.mail && <p style={{ color: "#F56565", marginTop: "0.5rem" }}>{errors.mail.message}</p>}
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="phone" style={{ color: "#A0AEC0", marginBottom: "0.5rem" }}>Telefone</label>
            <input
              id="phone"
              type="text"
              {...register("phone")}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #3a3f4a",
                backgroundColor: "#3a3f4a",
                color: "#fff",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#00BFFF"}
              onBlur={(e) => e.target.style.borderColor = "#3a3f4a"}
            />
            {errors.phone && <p style={{ color: "#F56565", marginTop: "0.5rem" }}>{errors.phone.message}</p>}
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="password" style={{ color: "#A0AEC0", marginBottom: "0.5rem" }}>Senha</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #3a3f4a",
                backgroundColor: "#3a3f4a",
                color: "#fff",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#00BFFF"}
              onBlur={(e) => e.target.style.borderColor = "#3a3f4a"}
            />
            {errors.password && <p style={{ color: "#F56565", marginTop: "0.5rem" }}>{errors.password.message}</p>}
          </div>

          {error && <p style={{ color: "#F56565", marginBottom: "1.5rem", textAlign: "center" }}>{error}</p>}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: loading ? "#0B5ED7" : "#1E90FF",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
