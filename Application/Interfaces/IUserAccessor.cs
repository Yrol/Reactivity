namespace Application.Interfaces
{
    //This interface will be  used to get the currently logged in user
    public interface IUserAccessor
    {
         string GetCurrentUsername();
    }
}