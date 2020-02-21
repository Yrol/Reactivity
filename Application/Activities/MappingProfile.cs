using AutoMapper;
using Domain;

namespace Application.Activities
{
    //This class will be used define the relationship between object. Hence, the objects can be mapped with each other automatically
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //creating the mapping between Activity an ActivityDto objects.
            //AutoMapper is convension based and it'll map the properties with equal names in both objects
            CreateMap<Activity, ActivityDto>();

            //additional mapper for attendees
            CreateMap<UserActivity, AttendeeDto>();
            
        }
    }
}