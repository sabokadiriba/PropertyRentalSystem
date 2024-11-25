namespace PROPERTYRENTALPORTALAPI.Models.ViewModels
{
    public class RentRequestCreateDTO
    {
        public int PropertyId { get; set; }
       
 
    }

    public class RentRequestUpdateDTO
    {
        public string Seeker { get; set; }

        public int PropertyId { get; set; }
        public string SeekerId { get; set; }
        public bool IsContactShared { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public int? RentRequestId { get; set; }
        public DateTime? RequestDate { get; set; }

    }
    public class OwnerSeeRentRequestDTO
    {
       
        public bool IsContactShared { get; set; }
        public DateTime? FollowUpDate { get; set; } 
        public DateTime? RequestDate { get; set; }

    }
}
