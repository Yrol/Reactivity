using Domain;

namespace Application.Interfaces
{
    //interface for generating tokens
    public interface IJwtGenerator
    {
        //When we pass a user(Appuser),  this method will return a JWT string back 
         string CreateToken(AppUser user);
    }
}