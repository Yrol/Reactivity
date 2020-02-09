using FluentValidation;

namespace Application.Validators
{
    //This is a custom password validation class which extends the IRuleBuilder of the FluentValidation
    //This can be used as "RuleFor(x => x.Password).Password()"
    //This class can be reused when the password validation is needed with Fluent and eliminate the need for chaining in Fluent
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty()
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .Matches("[A-Z]").WithMessage("Password must contain at least 1 uppercase letter")
                .Matches("[a-z]").WithMessage("Password must contain at least 1 lower letter")
                .Matches("[0-9]").WithMessage("Password must contain a number")
                .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain non alphanumeric");

            return options;
        }
    }
}