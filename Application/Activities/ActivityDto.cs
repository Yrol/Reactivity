using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Application.Activities
{
    //This is the DTO for returning activities
    //This will be mapped with Activity.cs using the AutoMapper
    public class ActivityDto
    {

        public Guid Id { get; set;}
        public string Title {get; set;}
        public string Description {get; set;}
        public string Category {get; set;}
        public DateTime Date {get; set;}
        public string City {get; set;}

        //Returning the attendees of this activity
        //"JsonPropertyName" will change the return "UserActivities" object attached to each Activity as "attendees"
        [JsonPropertyName("attendees")]
        public ICollection<AttendeeDto> UserActivities { get; set; }
    }
}