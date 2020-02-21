using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Application.Activities
{
    //This is the DTO for returning activities
    public class ActivityDto
    {

        public Guid Id { get; set;}
        public string Title {get; set;}
        public string Description {get; set;}
        public string Category {get; set;}
        public DateTime Date {get; set;}
        public string City {get; set;}

        //Returning the attendees of this activity

        [JsonPropertyName("attendees")]
        public ICollection<AttendeeDto> UserActivity { get; set; }
    }
}