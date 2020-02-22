using AutoMapper;
using Domain;

namespace Application.Activities
{
    //This class will be used define the relationship between object. Hence, the objects can be mapped with each other automatically
    //this class inherits the Profile of AutoMapper library
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //creating the mapping between Activity and ActivityDto objects.
            //AutoMapper is convension based and it'll map the properties with equal names in both objects
            CreateMap<Activity, ActivityDto>();

            //additional mapper for UserActivity (attendees) defined in both Activity and ActivityDto objects -  this is because unlike  above it requires special configuration map fields
            CreateMap<UserActivity, AttendeeDto>()
                //Define where we're mapping from destination is AttendeeDto and  the source is UserActivity.AppUser (since the mapping values is not directly inside the UserActivity but inside the "UserActivity.AppUser")
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.AppUser.DisplayName));
            
        }
    }
}