using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PROPERTYRENTALPORTALAPI.Data;
using PROPERTYRENTALPORTALAPI.Models.Domain;
using PROPERTYRENTALPORTALAPI.Models.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PROPERTYRENTALPORTALAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PropertiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Properties
        [HttpGet("GetProperties")]
        public async Task<ActionResult<IEnumerable<PropertyViewDTO>>> GetProperties()
        {
            // Retrieve the current user's identifier and role from the claims
            var userIdClaim = User.FindFirst("userId")?.Value; // Claim type for user ID
            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value; // Claim type for role (e.g., "Owner" or "Seeker")

            if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(userRoleClaim))
            {
                return Unauthorized("User not authenticated or role not found.");
            }

            // Filter based on role
            IQueryable<Property> query = _context.Properties
                .Include(p => p.Owner);
               

            if (userRoleClaim == "Owner")
            {
                // If the user is an Owner, only return properties they own
                query = query.Where(p => p.Owner.Id == userIdClaim);
            }

            // If the user is a Seeker or any other role, return all properties (no filtering needed)

            // Map to DTOs
            var properties = await query.Select(p => new PropertyViewDTO
            {
                PropertyId = p.PropertyId,
                Title = p.Title,
                Description = p.Description,
                PropertyType = p.PropertyType,
                County = p.County,
                City = p.City,
                State = p.State,
                Price = p.Price,
                Bedrooms = p.Bedrooms,
                Bathrooms = p.Bathrooms,
                IsAvailable = p.IsAvailable,
                ParkingIncluded = p.ParkingIncluded,  // New field
                PetsAllowed = p.PetsAllowed,  // New field
                Furnished = p.Furnished,  // New field
                AdditionalNotes = p.AdditionalNotes,  // New field

            }).ToListAsync();

            return Ok(properties);
        }



        [HttpGet("GetProperty/{id}")]
        public async Task<ActionResult<PropertyViewDTO>> GetProperty(int id)
        {
            var property = await _context.Properties
                .FirstOrDefaultAsync(p => p.PropertyId == id);

            if (property == null)
                return NotFound();

            // Manually map the entity to the DTO
            var propertyDTO = new PropertyViewDTO
            {
                PropertyId = property.PropertyId,
                Title = property.Title,
                Description = property.Description,
                PropertyType = property.PropertyType,
                County = property.County,
                City = property.City,
                State = property.State,
                Price = property.Price,
                Bedrooms= property.Bedrooms,
                Bathrooms= property.Bathrooms,
                IsAvailable = property.IsAvailable,
                ParkingIncluded = property.ParkingIncluded,  // New field
                PetsAllowed = property.PetsAllowed,  // New field
                Furnished = property.Furnished,  // New field

                AdditionalNotes = property.AdditionalNotes,  // New field

            };

            return Ok(propertyDTO);
        }


        // POST: api/RentRequest/CreateProperty
        [HttpPost("CreateProperty")]
        public async Task<ActionResult<Property>> CreateProperty([FromBody] PropertyCreateDTO propertyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var userIdClaim = User.FindFirst("userId")?.Value; // Replace "sub" with your claim type, e.g., "UserId" or "Email"
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User not authenticated.");
            }
            // Map DTO to Domain model
            var property = new Property
            {
                Title = propertyDto.Title,
                Description = propertyDto.Description,
                PropertyType = propertyDto.PropertyType,
                County = propertyDto.County,
                City = propertyDto.City,
                State = propertyDto.State,
                Price = propertyDto.Price,
                Bedrooms = propertyDto.Bedrooms,
                Bathrooms = propertyDto.Bathrooms,
                IsAvailable = propertyDto.IsAvailable,
                ParkingIncluded = propertyDto.ParkingIncluded,  // New field
                PetsAllowed = propertyDto.PetsAllowed,  // New field
                Furnished = propertyDto.Furnished,  // New field
   
                AdditionalNotes = propertyDto.AdditionalNotes,  // New field
                CreatedDate = DateTime.UtcNow,
                OwnerId=userIdClaim
            };

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            // Return the created property with its ID
            return CreatedAtAction(nameof(GetProperty), new { id = property.PropertyId, succeeded = true }, property);
        }

        // PUT: api/Properties/5
        [HttpPut("UpdateProperty/{id}")]
        public async Task<IActionResult> UpdateProperty(int id, [FromBody] PropertyUpdateDTO propertyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Find the existing property
            var existingProperty = await _context.Properties.FindAsync(id);
            if (existingProperty == null)
                return NotFound();

            // Update only the fields provided in the DTO
            existingProperty.Title = propertyDto.Title;
            existingProperty.Description = propertyDto.Description;
            existingProperty.PropertyType = propertyDto.PropertyType;
            existingProperty.County = propertyDto.County;
            existingProperty.City = propertyDto.City;
            existingProperty.State = propertyDto.State;
            existingProperty.Price = propertyDto.Price;
            existingProperty.Bedrooms = propertyDto.Bedrooms;
            existingProperty.Bathrooms = propertyDto.Bathrooms;
            existingProperty.IsAvailable = propertyDto.IsAvailable;
            existingProperty.ParkingIncluded = propertyDto.ParkingIncluded; // New field
            existingProperty.PetsAllowed = propertyDto.PetsAllowed;  // New field
            existingProperty.Furnished = propertyDto.Furnished;  // New field
            existingProperty.AdditionalNotes = propertyDto.AdditionalNotes;  // New field
      
            // Save changes to the database
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // DELETE: api/Properties/5
        [HttpDelete("DeleteProperty/{id}")]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var property = await _context.Properties.FindAsync(id);
            if (property == null)
                return NotFound();

            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the current user's ID
            var userRole = User.FindFirstValue(ClaimTypes.Role); // Get the user's role

            if (userRole == "Owner")
            {
                var totalProperties = await _context.Properties
                    .CountAsync(p => p.OwnerId == userId); // Adjust based on your DB schema
                return Ok(new { totalProperties });
            }
            else if (userRole == "Seeker")
            {
                var totalRequests = await _context.RentRequests
                    .CountAsync(r => r.SeekerId == userId); // Adjust based on your DB schema
                return Ok(new { totalRequests });
            }

            return BadRequest("Invalid role.");
        }


    }
}
