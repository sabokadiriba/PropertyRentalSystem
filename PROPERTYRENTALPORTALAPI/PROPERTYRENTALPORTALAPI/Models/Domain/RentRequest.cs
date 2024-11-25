namespace PROPERTYRENTALPORTALAPI.Models.Domain
{
    public class RentRequest
    {
        public int RentRequestId { get; set; }

        // Foreign key to Property
        public int PropertyId { get; set; }
        public Property Property { get; set; } // Navigational property

        // Foreign key to User (the Rent Seeker)
        public string SeekerId { get; set; }
        public ApplicationUser Seeker { get; set; } // Navigational property

        public DateTime RequestDate { get; set; }
        public bool IsContactShared { get; set; } // Determines if contact details are shared
        public DateTime? FollowUpDate { get; set; } // Optional date for follow-up actions
    }
}
