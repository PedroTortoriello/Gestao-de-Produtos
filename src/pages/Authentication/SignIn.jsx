import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import api from './api';
import Logo from './Logo.png'; // Substitua pelo caminho correto para a imagem

const AuthUserFormSchema = z.object({
  taxNumber: z.string().nonempty({ message: "CPF ou CNPJ é obrigatório" }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AuthUserFormSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Submitting data:", data); // Log de depuração
  
    try {
      const response = await api.post("/api/auth/login", data);
      console.log("Response from API:", response);
  
      if (response.data.success) {  // Verifique o campo 'success'
        console.log("Autenticação bem-sucedida!");
        // Armazenar o token no localStorage
        localStorage.setItem('token', response.data.data.token);
        navigate("/Dashboard/Produtos");
      } else {
        setError("Falha na autenticação. Por favor, verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Network error:", error);  // Log de depuração
      setError("Erro de rede. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
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
      <div
        className="login-form"
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
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column" }}>
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
              background: "linear-gradient(90deg, #00BFFF, #00A3CC)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.background = "linear-gradient(90deg, #00A3CC, #0096BB)"}
            onMouseLeave={(e) => e.target.style.background = "linear-gradient(90deg, #00BFFF, #00A3CC)"}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <p style={{ color: "#A0AEC0" }}>
              Não tem uma conta?{" "}
              <span
                onClick={() => navigate('/auth/signup')}
                style={{ color: "#1E90FF", cursor: "pointer", textDecoration: "underline" }}
              >
                Cadastre-se
              </span>
            </p>
          </div>
        </form>
      </div>

    </div>
  );
};

export default SignIn;
