using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PROPERTYRENTALPORTALAPI.Models.Domain;
using PROPERTYRENTALPORTALAPI.Models.ViewModels;
using PROPERTYRENTALPORTALAPI.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace PROPERTYRENTALPORTALAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RentRequestController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/RentRequests/createRentRequest
        [HttpPost("createRentRequest")]
        public async Task<IActionResult> CreateRentRequest([FromBody] RentRequestCreateDTO rentRequestCreateDTO)
        {
            if (rentRequestCreateDTO == null)
            {
                return BadRequest("Rent request data is required.");
            }

            var seekerId = User.FindFirst("userId")?.Value; // Replace "sub" with your claim type, e.g., "UserId" or "Email"
            if (string.IsNullOrEmpty(seekerId))
            {
                return Unauthorized("User not authenticated.");
            }

            // Fetch the Property from the database
            var property = await _context.Properties.FindAsync(rentRequestCreateDTO.PropertyId);

            if (property == null)
            {
                return NotFound("Property not found.");
            }

            // Create a new RentRequest instance
            var rentRequest = new RentRequest
            {
                PropertyId = rentRequestCreateDTO.PropertyId,
                SeekerId = seekerId,
                RequestDate = DateTime.UtcNow,
                IsContactShared = false, // Default value, can be updated based on further logic
                FollowUpDate = null // Default value
            };

            // Add RentRequest to the database
            _context.RentRequests.Add(rentRequest);

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle any error that might occur
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }

            // Return the created RentRequest object or a success response
            return CreatedAtAction("GetRentRequest", new { id = rentRequest.RentRequestId }, rentRequest);
        }

        // POST: api/RentRequest/ShareContact
        [HttpPost("ShareContact/{rentRequestId}")]
        public async Task<IActionResult> ShareContact(int rentRequestId)
        {
            var rentRequest = await _context.RentRequests.FindAsync(rentRequestId);

            if (rentRequest == null)
            {
                return NotFound("RentRequest not found.");
            }

            if (rentRequest.IsContactShared)
            {
                return BadRequest("Contact has already been shared.");
            }

            rentRequest.IsContactShared = true;
            rentRequest.FollowUpDate = null; // Reset follow-up date when contact is shared

            _context.Update(rentRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/RentRequest/FollowUp
        [HttpPost("FollowUp/{rentRequestId}")]
        public async Task<IActionResult> FollowUp(int rentRequestId)
        {
            var rentRequest = await _context.RentRequests.FindAsync(rentRequestId);

            if (rentRequest == null)
            {
                return NotFound("RentRequest not found.");
            }

            if (rentRequest.IsContactShared == false)
            {
                return BadRequest("Contact must be shared before following up.");
            }

            // Check if 24 hours have passed since the request
            if (rentRequest.RequestDate.AddHours(1) <= DateTime.Now)
            {
                rentRequest.FollowUpDate = DateTime.Now;
                _context.Update(rentRequest);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            return BadRequest("Follow-up can only be done after 24 hours.");
        }

        // GET: api/RentRequest/GetRentRequest/{id}
        [HttpGet("GetRentRequest/{id}")]
        public async Task<ActionResult<RentRequestCreateDTO>> GetRentRequest(int id)
        {
            var rentRequest = await _context.RentRequests
                .Where(r => r.RentRequestId == id)
                .FirstOrDefaultAsync();

            if (rentRequest == null)
            {
                return NotFound("RentRequest not found.");
            }

            var rentRequestDto = new RentRequestUpdateDTO
            {
                RentRequestId = rentRequest.RentRequestId,
                SeekerId = rentRequest.SeekerId,
                PropertyId = rentRequest.PropertyId,
                RequestDate = rentRequest.RequestDate,
                IsContactShared = rentRequest.IsContactShared,
                FollowUpDate = rentRequest.FollowUpDate
            };

            return Ok(rentRequestDto);
        }
        // GET: request By propert id
        [HttpGet("GetRentRequestByPropertyId/{propertyId}")]
        public async Task<ActionResult<IEnumerable<OwnerSeeRentRequestDTO>>> GetRentRequestsByPropertyId(int propertyId)
        {
            // Retrieve all rent requests for the given property ID
            var rentRequests = await _context.RentRequests
                .Where(r => r.PropertyId == propertyId)
                .ToListAsync();

            // Check if the list is empty
            if (!rentRequests.Any())
            {
                return NotFound("No rent requests found for the specified property.");
            }

            // Map the rent requests to DTOs
            var rentRequestDtos = rentRequests.Select(r => new OwnerSeeRentRequestDTO
            {
                RequestDate = r.RequestDate,
                IsContactShared = r.IsContactShared,
                FollowUpDate = r.FollowUpDate
            }).ToList();

            return Ok(rentRequestDtos);
        }
        // GET: api/RentRequest/GetAllRentRequests
        [HttpGet("GetAllRentRequests")]
        public async Task<ActionResult<IEnumerable<RentRequestUpdateDTO>>> GetAllRentRequests()
        {
            var userIdClaim = User.FindFirst("userId")?.Value; // Claim type for user ID

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User not authenticated or role not found.");
            }

            // Ensure that userIdClaim and SeekerId are compared properly as strings
            var rentRequests = await _context.RentRequests
                .Where(r => r.SeekerId == userIdClaim)
                .ToListAsync();  // Use ToListAsync for async queries

            if (!rentRequests.Any())
            {
                return NotFound("No rent requests found.");
            }

            var rentRequestDtos = rentRequests.Select(r => new RentRequestUpdateDTO
            {
                RentRequestId = r.RentRequestId,
                SeekerId = r.SeekerId,
                PropertyId = r.PropertyId,
                RequestDate = r.RequestDate,
                IsContactShared = r.IsContactShared,
                FollowUpDate = r.FollowUpDate
            }).ToList();

            return Ok(rentRequestDtos);
        }

    }
}
