var builder = WebApplication.CreateBuilder(args);


// Add Controllers
builder.Services.AddControllers();


// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();



// Swagger configuration
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// HTTPS disabled for local development
// app.UseHttpsRedirection();



app.UseAuthorization();


// Map Controllers
app.MapControllers();



app.Run();