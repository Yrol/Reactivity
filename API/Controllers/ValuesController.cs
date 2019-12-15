 using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _context;

        //using dependency injection to inject DataContext 
        public ValuesController(DataContext context)
        {
            _context = context;
        }

        //Using Async to move requests to another thread - this will make sure the Request thread will not be blocked
        //Return "OK" will return results with status 200
        //ToListAsync is the Async version of ToList
        //We're using Async because call to a DB has the potential to a long running task
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Value>>> Get()
        {
            var values = await _context.Values.ToListAsync();
            return Ok(values);
        }

        //FindAsync will return the mathcing row or null
        [HttpGet("{id}")]
        public async Task<ActionResult<Value>> Get(int id)
        {
            //var value = await _context.Values.FirstOrDefaultAsync(r=>r.Id == id);
            var value = await _context.Values.FindAsync(id);
            return Ok(value);
        }
    }
}