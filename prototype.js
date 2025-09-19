// player => run, jump, kickBall
// .....=>age => grow, age, energy

let player = {};
player.name = "toto";
player.age = 20;    
player.energy = 100;
player.run = function() {
    console.log(this.name + " is running");
    this.energy -= 10;
};

