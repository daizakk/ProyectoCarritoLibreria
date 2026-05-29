using LibreriaPedroApi.DTOs;
using LibreriaPedroApi.Models;
using LibreriaPedroApi.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LibreriaPedroApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioRepository _repository;
        private readonly IConfiguration _configuration; // ✅ AÑADIR


        public UsuariosController(IUsuarioRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UsuarioResponseDto>> Login([FromBody] UsuarioLoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuario = await _repository.LoginAsync(dto.Email, dto.Password);
            if (usuario == null)
                return Unauthorized(new { message = "Credenciales incorrectas" });

            var response = MapToResponseDto(usuario);
            response.Token = GenerarToken(usuario); 
            return Ok(response);
        }

        [HttpPost("registro")]
        public async Task<ActionResult<UsuarioResponseDto>> Registro([FromBody] UsuarioRegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuarioExistente = await _repository.GetByEmailAsync(dto.Email);
            if (usuarioExistente != null)
                return BadRequest(new { message = "El email ya está registrado" });

            if (string.IsNullOrWhiteSpace(dto.Nombre))
                return BadRequest(new { message = "El nombre es requerido" });

            var usuario = await _repository.RegistroAsync(dto);
            if (usuario == null)
                return BadRequest(new { message = "Error al crear el usuario" });

            var response = MapToResponseDto(usuario);
            response.Token = GenerarToken(usuario); // ✅
            return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, response);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioResponseDto>>> GetAll()
        {
            var usuarios = await _repository.GetAllAsync();
            var response = usuarios.Select(u => MapToResponseDto(u));
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioResponseDto>> GetById(int id)
        {
            var usuario = await _repository.GetByIdAsync(id);
            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado" });

            var response = MapToResponseDto(usuario);
            return Ok(response);
        }

        private UsuarioResponseDto MapToResponseDto(Usuario usuario)
        {
            return new UsuarioResponseDto
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre ?? usuario.Username,
                Email = usuario.Email,
                Telefono = usuario.Telefono,
                Direccion = usuario.Direccion,
                Ciudad = usuario.Ciudad,
                Role = usuario.Role // ✅ AÑADIR
            };
        }
        private string GenerarToken(Models.Usuario usuario)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
        new Claim(ClaimTypes.Email, usuario.Email),
        new Claim(ClaimTypes.Role, usuario.Role ?? "User")
    };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
