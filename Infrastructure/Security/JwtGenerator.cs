using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Interfaces;
using Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        private readonly SymmetricSecurityKey _key;
        public JwtGenerator(IConfiguration configuration)
        {
            //"configuration["TokenKey"]" is the Key that has been generated using "dotnet user-secrets set "TokenKey" "super secret key" -p .\API\"
            //this key is stored somewhere in the local machine
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["TokenKey"]));
        }

        public string CreateToken(AppUser user)
        {
            //data 
            var claims = new List<Claim>
            {
                //this will add the username (get from "user.UserName") to the "nameid" property of the JWT token
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
            };

            //generate signing credentials that requires to sign the token from our API before it get sent to the user
            //This information will be used to validate token (without  having to query the DB)
            //var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super secret key"));
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            //Data inside the token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7), //expiry date (can be used for 7 days)
                SigningCredentials = creds
            };

            //generating and writing the token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token  = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}