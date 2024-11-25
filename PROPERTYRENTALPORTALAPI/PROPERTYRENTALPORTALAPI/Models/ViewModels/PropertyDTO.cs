namespace PROPERTYRENTALPORTALAPI.Models.ViewModels
{
    public class PropertyCreateDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string PropertyType { get; set; }
        public string County { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public decimal Price { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public bool IsAvailable { get; set; }

        // New fields added for PropertyCreateDTO
        public bool ParkingIncluded { get; set; } // Indicates if parking is included
        public bool PetsAllowed { get; set; } // Indicates if pets are allowed
        public string Furnished { get; set; } // Level of furnishing (None, Semi, Fully)
        public string AdditionalNotes { get; set; } // Additional notes about the property
    }

    public class PropertyUpdateDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string PropertyType { get; set; }
        public string County { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public decimal Price { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public bool IsAvailable { get; set; }

        // New fields added for PropertyUpdateDTO
        public bool ParkingIncluded { get; set; }
        public bool PetsAllowed { get; set; }
        public string Furnished { get; set; }
     
        public string AdditionalNotes { get; set; }
    }

    public class PropertyViewDTO
    {
        public int PropertyId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string PropertyType { get; set; }
        public string County { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public decimal Price { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public bool IsAvailable { get; set; }

        // New fields added for PropertyViewDTO
        public bool ParkingIncluded { get; set; }
        public bool PetsAllowed { get; set; }
        public string Furnished { get; set; }
      
        public string AdditionalNotes { get; set; }
    }
}
