using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PROPERTYRENTALPORTALAPI.Data;
using PROPERTYRENTALPORTALAPI.Models.Domain;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
  .AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

// Services from Identity Core.
builder.Services
    .AddIdentityApiEndpoints<ApplicationUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.Configure<IdentityOptions>(options =>
    {
      options.Password.RequireDigit = false;
      options.Password.RequireUppercase = false;
      options.Password.RequireLowercase = false;
      options.User.RequireUniqueEmail = true;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme =
    x.DefaultChallengeScheme =
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(y =>
{
    y.SaveToken = false;
    y.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["AppSettings:JWTSecret"]!)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

});
builder.Services
            .AddAuthorization(options =>
        {
        options.FallbackPolicy = new AuthorizationPolicyBuilder()
          .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
          .RequireAuthenticatedUser()
          .Build();
        });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

#region Config. CORS
app.UseCors(options =>
    options.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader());
#endregion

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app
    .MapGroup("/api")
    .MapIdentityApi<ApplicationUser>();



app.MapPost("/api/signup", async (
    UserManager<ApplicationUser> userManager,
    [FromBody] UserRegistrationModel userRegistrationModel
    ) =>
    {
      ApplicationUser user = new ApplicationUser()
      {
        UserName = userRegistrationModel.Email,
        Email = userRegistrationModel.Email,
        FullName = userRegistrationModel.FullName,
       
      };
      var result = await userManager.CreateAsync(
          user,
          userRegistrationModel.Password);
        await userManager.AddToRoleAsync(user, userRegistrationModel.Role);
        if (result.Succeeded)
        return Results.Ok(result);
      else
        return Results.BadRequest(result);
    }).AllowAnonymous();
app.MapPost("/api/signin", async (
    UserManager<ApplicationUser> userManager,
    [FromBody] LoginModel loginModel) =>
    {
        var user = await userManager.FindByEmailAsync(loginModel.Email);
        if (user != null && await userManager.CheckPasswordAsync(user, loginModel.Password))
        {
            var roles = await userManager.GetRolesAsync(user);
            var signInKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:JWTSecret"])
                            );
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("userId",user.Id.ToString()),
                    new Claim(ClaimTypes.Role,roles.First()),
                    new Claim("fullName",user.FullName.ToString()),
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(
                    signInKey,
                    SecurityAlgorithms.HmacSha256Signature
                    )
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(securityToken);
            return Results.Ok(new { token });
        }
        else
            return Results.BadRequest(new { message = "Username or password is incorrect." });
    }).AllowAnonymous();

app.Run();

public class UserRegistrationModel
{
  public string Email { get; set; }
  public string Password { get; set; }
  public string FullName { get; set; }
  public string Role { get; set; }

}
public class LoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}