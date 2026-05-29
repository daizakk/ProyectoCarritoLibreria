using LibreriaPedroApi.DTOs;
using LibreriaPedroApi.Models;
using LibreriaPedroApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibreriaPedroApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly IPedidoRepository _repository;
        private readonly ILibroRepository _libroRepository;

        public PedidosController(IPedidoRepository repository, ILibroRepository libroRepository)
        {
            _repository = repository;
            _libroRepository = libroRepository;
        }

        [Authorize]
        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<PedidoResponseDto>>> GetByUsuario(int usuarioId)
        {
            var pedidos = await _repository.GetByUsuarioIdAsync(usuarioId);
            var response = pedidos.Select(p => new PedidoResponseDto
            {
                Id = p.Id,
                UsuarioId = p.UsuarioId,
                FechaPedido = p.FechaPedido,
                Total = p.Total,
                Estado = p.Estado,
                Detalles = p.Detalles.Select(d => new DetallePedidoResponseDto
                {
                    LibroId = d.LibroId,
                    Titulo = d.Libro?.Titulo ?? string.Empty,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario
                }).ToList()
            });
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("todos")]
        public async Task<ActionResult<IEnumerable<PedidoResponseDto>>> GetAll()
        {
            var pedidos = await _repository.GetAllAsync();
            var response = pedidos.Select(p => new PedidoResponseDto
            {
                Id = p.Id,
                UsuarioId = p.UsuarioId,
                FechaPedido = p.FechaPedido,
                Total = p.Total,
                Estado = p.Estado,
                Detalles = p.Detalles.Select(d => new DetallePedidoResponseDto
                {
                    LibroId = d.LibroId,
                    Titulo = d.Libro?.Titulo ?? string.Empty,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario
                }).ToList()
            });
            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] PedidoRequestDto dto)
        {
            if (dto.Items == null || dto.Items.Count == 0)
                return BadRequest(new { message = "El pedido no tiene items" });

            foreach (var item in dto.Items)
            {
                var libro = await _libroRepository.GetByIdAsync(item.LibroId);
                if (libro == null)
                    return NotFound(new { message = $"Libro {item.LibroId} no encontrado" });

                if (libro.Stock < item.Cantidad)
                    return BadRequest(new { message = $"Stock insuficiente para '{libro.Titulo}'" });

                libro.Stock -= item.Cantidad;
                _libroRepository.Update(libro);
            }

            var pedido = new Pedido
            {
                UsuarioId = dto.UsuarioId,
                FechaPedido = DateTime.Now,
                Total = dto.Items.Sum(i => i.Cantidad * i.PrecioUnitario),
                Estado = "Pendiente",
                Detalles = dto.Items.Select(i => new DetallePedido
                {
                    LibroId = i.LibroId,
                    Cantidad = i.Cantidad,
                    PrecioUnitario = i.PrecioUnitario
                }).ToList()
            };

            await _repository.AddAsync(pedido);
            await _repository.SaveAsync();

            return Ok(new { message = "Pedido creado", pedidoId = pedido.Id });
        }
    }
}