public class UsuarioResponseDto
{
    public int Id { get; set; }
    public string? Nombre { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? Ciudad { get; set; }
    public string? Role { get; set; } // ✅ AÑADIR
    public string? Token { get; set; }
}