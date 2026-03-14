## Summary

In summary, this was a competition where teams of four were tasked with creating a fully autonomous robot from scratch (no robotics components were permitted) in 4 months. My team successfully turned a collection of PCBs, 3D printed + laser cut components, sensors, motors, and more into a fully functional autonomous robot. Our focus was on reliability, and it paid off with a 2nd place finish in the competition!

![Pets!](/project_markdown_text/robot-summer/pet-lineup.jpg)
Take a look at the cute pets!


## Setup

Called “Robot Summer” ([Competition Page](https://projectlab.engphys.ubc.ca/enph-253-2025/)), this is a competition where the goal is to design an autonomous robot that can complete some task given by the organizers/instructors. For our year, the topic was “Pet Rescue”. The premise: A building is on fire, and while people are out safe, many pets are stuck inside and need rescuing. To help with that, and to prevent harming human lives, the competitors are to design a robot that can autonomously go into the building and rescue the pets.

A burning building filled with trapped pets was represented by an obstacle course with stuffed animals scattered around. Points are collected by getting pets to the “safe area”, and in the event of a tie (matching points), the quicker team is awarded the win. See below for the competition surface layout:

![Environment Layout](/project_markdown_text/robot-summer/environment_layout.png)

To add some spice to the competition, a few options to get the pets out exist. The simplest way is to grab the pets, then drive out to the safe zone. Teams can also use the bucket over the save zone, which has an infrared emitter to launch the pets into the safe zone. Right by the second pet, there is also a window overlooking the safe zone, through which pets can be pushed out. Lastly, at the end of the course, there is a zipline that leads the pets back to the safe zone.

To tackle this problem we formed a team of 4:
- Me (Evan): Elec and Software
- Andrew: Mech
- Nolan: Elec
- Nathan: Mech and Software

Big shout-out to each of my teammates; they all did a fantastic job, and I couldn’t have done it without them! (We all just pulled an all-nighter, so please excuse the messy look.)

![Our Team](/project_markdown_text/robot-summer/team.jpg)

Overall, this was completed over the course of four months covering the spring and summer terms. Moreover, all four of us took six classes each over the first two months, leaving almost all the work to be done over the last two months.

## Drive System
Our first focus was to implement drive and navigation systems; after all, it doesn’t matter how good our retrieval is if we can’t get to the pets. Our drive system was to be centred on two brushed DC motors with speed and direction control via a PWM controlled H-bridge PCB. The H-bridge circuit used differential PWM, allowing us to control the direction by only activating one pair of MOSFETs at a time. Below are the schematic and PCB layout for our H-Bridge. Credit to Nolan, who did the PCB layout and soldered the components for us. It was a fantastically reliable design, working perfectly and only blowing a single time, far better than every other team.

![H-bridge Schematic](/project_markdown_text/robot-summer/H-bridge_schematic.png)
![H-bridge PCB](/project_markdown_text/robot-summer/H-bridge_PCB.png)

The H-bridge was controlled by an ESP32, using PWM to vary the speed, and deciding which MOSFETs to use depending on the desired direction. I created the `motors.h` package to encapsulate the motor control, using the LEDC library for PWM, and centred around using the `setMotorsSpeed` function to control the motors:

```c++
/**
* Sets the speed of the motor, positive pwm = forward, negative pwm = backwards
*/
void setMotorsSpeed(int left_pwm, int right_pwm);
```

Speaking of controlling the motors, the next step was to use this motor control to do what we need:

## Navigation
The core of the navigation system was to follow the black tape line. There were a few spots in the environment where special care had to be taken, which I will get back to.

To follow the line, we took advantage of the change in reflectance between the black tape and the otherwise white surface. IR reflectance sensors, combining an IR LED with a phototransistor, we are able to detect whether the sensor is pointed at the tape by monitoring the voltage out of the phototransistor using the ADC of our ESP32. A few problems arise, however. Firstly, a single sensor won't give us the direction information needed to control a PID algorithm with. To solve this, we can simply add another sensor.

Another issue was inconsistencies between sensors - they were cheap and poorly built. Furthermore, using the ESP32's ADC was slower and more complicated. I solved both of these problems by implementing a comparator circuit that read the output of the phototransistors, and would either output a HIGH or LOW value depending on the comparison voltage set by a potentiometer. By adjusting the comparison voltage, we could get the signals to trigger at the same light levels, and the ESP32 could read a digital signal. Of course, by feeding a digital signal into the ESP32, we lose some proportional error information. I compensated for this by adding a second set of reflectance sensors, allowing for 2 levels of proportionality.

One last issue was dealing with background noise. The IR LED isn't the only source of light, and if left exposed to the room, the photodiode struggles to meaningfully change the output voltage when pointed at the black line. As such, we had to mount the sensors close to the ground, and design and 3D print a shroud to block light coming in from the sides.

Putting all of that together, I created the following schematic:
![Comparator Circuit Schematic](/project_markdown_text/robot-summer/comparator_schematic.png)

Proof of concept was tested on a circuit built on a protoboard, then I designed and assembled a PCB for the comparators:
![Comparator PCB](/project_markdown_text/robot-summer/comparator_pcb.png)

As well as a PCB for mounting the reflectance sensors, made in 3 different sizes to allow for us to experiment with sensor spacing (and height off the ground):
![Reflectance PCBs](/project_markdown_text/robot-summer/reflectance_pcb.png)

With the hardware designed, the next step was to implement the firmware. A few key features that had to be designed was PID control (taking our sensor layout into account), and interrupt ability (for stops and starts we will use in the future).

I designed the `TapeSensor` class, allowing us to set up and access the sensors conveniently:
```c++
class TapeSensor {
    private:
        int* sensor_values; // Array to store the values from the tape sensors
        int* sensor_pins; // Array to store the pins for tape sensors
        int num_sensors; // Number of tape sensors

         /**
         * Sets up the tape sensor pins.
         */
        void setup_tape_sensors(int num, int sensor_pins[]);


    public:

        TapeSensor(int num, int chosen_sensor_pins[]) {
            this->num_sensors = num; // Set the number of tape sensors
            this->sensor_pins = new int[num_tape_sensors]; // Allocate memory for the pins
            this->sensor_values = new int[num_tape_sensors]; // Allocate memory for the sensor

            for (int i = 0; i < num; i++) {
                this->sensor_pins[i] = chosen_sensor_pins[i]; // Initialize the sensor pins
                this->sensor_values[i] = 0; // Initialize the sensor values
            }

            setup_tape_sensors(this->num_sensors, this->sensor_pins); // Set up the tape sensors
        }

        int get_num_tape_sensors() {
            return this->num_sensors; // Return the number of tape sensors
        }

        /**
         * Get's the values from the tape sensors and stores them in the pull_values array.
         * @param num_sensors The number of sensors to read values from.
         * @param pull_values An array to store the sensor values.
         */
        void get_tape_sensor_values(int pull_values[]);

};
```

In combination, the `feedback_motor_control.h` package uses the sensor values and a desired speed, then uses a tuned PID algorithm to adjust the motor speeds accordingly. The most important function was:

```C++

 * @brief Adjusts the motor speeds based on the tape sensor outputs. Will operate until the operate variable is set to 1.
 * This one can drive the motor in reverse
 * @returns the last error value
 */
int feedback_motor_control_with_reverse(volatile int* operate, int num_tape_sensors, Motors motors, TapeSensor tapeSensor, int initial_speed, int last_err) {

    int left_right_pwm[2] = {initial_speed, initial_speed}; // Array to store the PWM values for left and right motors
    int error = 0; // Initialize error variable
    int triggered = 0;
    int last_error = last_err;
    int m = 1;
    int q = 0;
    int iteration_counter = 0;
    int p = 0;
    int d = 0;
    int con = 0;
    int tape_sensor_output[num_tape_sensors]; // Array to store the tape sensor outputs

    Serial.printf("feedback_motor_control: num_tape_sensors = %d\n", num_tape_sensors);

    while(*operate == 0) {
        tapeSensor.get_tape_sensor_values(tape_sensor_output); // Get the tape sensor values
        triggered = 0;
        error = 0;
        
        //assuming that 1 means HIGH means on white, LOW means on black
        //assuming output goes from left to right
        for(int i = 0; i < num_tape_sensors/2; i++){
            if(tape_sensor_output[i] == 0) { // If the left sensors detects black
                error += (num_tape_sensors/2 - i); // Increase error based on distance from center
                triggered = 1;
            }
            if(tape_sensor_output[num_tape_sensors - 1 - i] == 0) { // If the right sensors detects black
                error -= (num_tape_sensors/2 - i); // increase error based on distance from center
                triggered = 1;
            }
            if(triggered == 1){
                break;
            }
        }

        //History
        if(triggered == 0){
            error = last_error;
        }
        if(triggered == 0 && abs(last_error) >= num_tape_sensors/2) { // If no sensors detect black
            error = last_error*2;
            error = constrain(error, -(num_tape_sensors/2 + 1), (num_tape_sensors/2 + 1)); // Constrain error to prevent overflow
        }

        //Derivative approx
        if(error != last_error){
            q = m;
            m = 1;
        }

        p = kp * error; // Proportional term
        d = (int)((float)kd * (float)(error - last_error)/(float)(q + m)); // Derivative term
        con = p + d;

        if(iteration_counter == -1){
            Serial.printf("P: %f, D: %f, I: %f\n", kp, kd, ki);
            iteration_counter = 0;
            Serial.printf("Tape Sensor Values: \n");
            for(int i = 0; i < num_tape_sensors; i++) {
                Serial.printf("%d ", tape_sensor_output[i]); // Print tape sensor values
            }
            Serial.printf("\nError: %d, con: %d, left_pwm: %d, right_pwm: %d\n", error, con, left_right_pwm[0] + con, left_right_pwm[1] - con);
        }

        motors.setMotorsSpeed(left_right_pwm[0] + con, left_right_pwm[1] - con);

        iteration_counter++;
        m++;
        last_error = error; // Update last error for next iteration

    }
    return last_error;

}
```
In this case, driving in reverse referred to the PID being able to set a negative duty cycle (which corresponded to a reversal of wheel drive direction). This allowed for tighter turns and higher speeds.

## First Milestone
Here we are, an ESP32 setup with PWM to control the drive system, and PID to follow a line with reflectance sensor input. This marked our first milestone, where we had a bot able to follow lines!

<video width="640" height="360" autoPlay muted loop playsInline poster="/robot-summer/video-placeholder.jpg">
    <source src="/project_markdown_text/robot-summer/line_following_test1.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

## Pet Detection
The next key challenge was to detect the pets as we drove up to/by them. The pets had a small magnet embedded in their foreheads by the organisers, the intention was to use hall effect sensors to detect them, however in order to prevent using magnets to lift the pets, the magnets were extremely weak, and the hall effect sensors we tested could only detect them at about 2 inches or less befor being overwhelmed by Earth's magnetic field. 

Our next idea was to try a magnetometer we found online. This did give us more range, about 6 inches, and it also came with 3 axes, plus an I2C connection. While much better, and it will prove to be very useful to home into the pets, the range was still too short to detect the pets while driving by.

The solution came in the form of Time of Flight (ToF) sensors. We used VL53L1X modules, which gave us a massive range, up to several meters, far more than necessary. The main disadvantage is that they couldn't explicitly differentiate between pets and other obstacles.

In terms of differentiating the pets, I decided to mount two ToF sensors pointed out to the side, angled slightly forward, high enough to peer over obstacles but lower than the height of the pets. I then implemented an algorithm to look for sharp drops in measured distance. After a little tuning, this was able to detect all pets and ignore most objects with a few exceptions.

## Pet Retrival
The second stage of pet detection brings the magnetometer back into focus. By mounting the magnetometer on the end of an arm (to be discussed below), we could extend it towards the (assumed) pet location, and verify if a pet is actually there. 

Mounting it on the arm is key. This allows us to bring the magnetometer over towards the pet, within its 6 inch range, and also away from the extremely magnetically noisy motors. We could also use the 3-axis data to guide the claw, also mounted on the arm, towards the pet. Furthermore, a second magnetometer was mounted on the back of the robot, and this allowed us to subtract Earth's magnetic field from the magnetic field measurements.

Nathan and Andrew were instrumental in designing and programming the arm. The name of the game here, like the rest of the robot, was simplicity and reliability. As such, we limited the number of joints - a rotating base, a pivot from the base, a wrist joint, and a claw mechanism. Just 4 joints, all driven by servo motors, which gave us accuracy and simplicity, at the cost of some flexibility.

![Arm prototype](/project_markdown_text/robot-summer/arm-prototype.jpg)
This image shows a prototype of the arm design.

Let's say now that the arm detected a pet, its next action would be to do a quick sweep and home into the pet. Because our arm has a shoulder and wrist joint, it has no way to extend or retract at a given height. We solved this by allowing it to send commands to the motors, shifting the entire robot forwards or back (due to our multi-MCU setup, this proved to be a little challenging; I will cover this in the Integrate everything section).

While simple in concept, tuning and adjusting both the arm hardware and software took us months. In fact, until the night before the competition, our arm system was slow and super unreliable, but by swapping in some stronger servos, rewriting the homing algorithm, and tuning overnight, we achieved one of the fastest and most reliable systems out of all the teams.

## Pet Rescue

Finding and collecting the pets was only half the battle. They also had to be removed from the "burning building" by placing them into the safe zone. Following our reliability and simplicity first dogma, we opted to place carried pets in a basket and drive the robot out of the building. There are two exceptions, however. Between the locations  of the first and second pets, there is a ramp that overlooks the safe zone. This is a prime spot to simply throw the pets into the safe zone, saving some time and basket space. We did this with the first pet (picked it up, then threw it over as we drove up the ramp), as well as the second pet (picked up on the return trip, and thrown over as we drove by).

<video width="640" height="360" autoPlay muted loop playsInline poster="/robot-summer/video-placeholder.jpg">
    <source src="/project_markdown_text/robot-summer/pickup_and_drop.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

On a side note: We also experimented with throwing the pets into the overhead basket for several months, getting as far as a working launcher. As fun as it was, we ultimately scrapped the idea due to difficulty integrating it with the rest of the system with the time we had left.

## Integrating everything
Integration, of course, introduced many new problems. Chief among them was the realisation that the ESP32 Pico we were using didn't have enough usable pins for all of our sensors. Our solution: Let's use two! Aside from getting more pins, it also gave us more parallelization. I designed the system such that one ESP was in charge of navigation and drive systems. Other ESP monitored other sensors and controlled the arm to retrieve pets. The two ESP's communicated via a UART connection, with the sensor/pet retrieval ESP in charge. For future reference, the sensor/pet retrieval ESP is the "Sensor ESP", while the motor and navigation ESP is the "Motor ESP".

The typical flow went like the following:

Sensor ESP sends signal to start moving --> Motor ESP starts moving --> Sensor ESP watches for pets --> When a pet is detected, Sensor ESP sends signal to stop --> Motor ESP stops --> Sensor ESP uses arm to home and retrieve pet, sending movement instructions to motor ESP if needed --> Once retrieved, Sensor ESP sends signal to move --> Repeat

<video width="640" height="360" autoPlay muted loop playsInline poster="/robot-summer/video-placeholder.jpg">
  <source src="/project_markdown_text//robot-summer/pickup_and_store.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Competition and the night Before

Our entire team, and most of our competitors, pulled an all-nighter before the competition scheduled in the morning, as the organizers set up the final competition surfaces. 

Going into the final day, we had a lot going for us. Thanks to Andrew and Nolan's work, our mechanical and electrical systems all worked flawlessly (and they continued to throughout the rest of the night! An enourously helpful circumstance). Our navigation, drive and pet detection systems also worked perfectly, though tuning was needed. Our main issue was the homing and pickup sequence. At the start of the night, we struggled to properly use the information provided by the magnetometer to home, and combined with some logic issues, pet retrival was increadibly slow and had a very high fail rate. Lucky for us, just as the night started, Nathan figured out the issues with the logic, and our retrieval went from barely working and slow to super fast and consistent. Some tuning was still needed, which we spent the rest of the night on, but all of a sudden, we had a chance in this competition.

After hours of tuning, as the sun rose, we had a robot that was consistently retrieving 5 out of 7 pets - the other two we decided to avoid since it could cause issues with getting back to the safe zone (which was required for us to score the points).

The format of the competition was a pools round, where all teams go twice, then the organizers choose the top 8 teams to go on to the elimination. In our very first run, a new bug reared it's head as on the return trip, after throwing pet 2 into the safe zone, the robot slammed into the wall along the ramp and drove stright off the edge. Luckily, Nolan caught it, and the other team had issues too, so we won that round. I made the decision that we shouldn't do anything to the robot, as the robot had never shown this issue previously, and I was worried that any changes we made would be more likely to introduce new issues.

As the competition progressed, our decision to focus on reliably getting 5 out of 7 pets started paying off. Many losses that occurred were due to the team's robot failing to return to the safe zone with the pets they had picked up. For the most part, our robot struggled a little more than we would have liked, often one pet would slip out of the claw, leaving us with 4 out of 7, but because of our consistency and speed, we still managed to get all the way to the finals!

In the finals, our robot unfortunately missed one of the 5 pets, and even worse, it decided to get stuck and drive off the edge for the second time. This time we caught it on camera, and I'll discuss the issue in the Limitations section below. In the end, the other team, though also running into issues, managed to deliver more than the 2 pets we did, taking the win. Despite the final run, our team still secured 2nd place!



![Robot after competition](/project_markdown_text/robot-summer/robot_after.jpg)

## Limitations
While very capable, our robot had a few limitations. 

Firstly, the last pet was located behind some "rubble", which would interrupt line following and, more importantly, cause the robot to veer off the line or even get stuck. We had several solutions to this issue, but they all had drawbacks, and as the deadline approached, we ultimately decided to ignore the final pet.
- Solution 1: Speed up the approach to the rubble. While this did allow us to get over the rubble most of the time, it wasn't consistent enough for us to be willing to risk it. Furthermore, even when successful, it would often cause the robot to lose the line.
- Solution 2: Raise the robot. This was difficult to do because our reflectance sensors needed to be close to the ground, which also didn't necessarily ensure that the robot would stay on the line after crossing the rubble

While we ended up time-limited, if I were to continue working on this problem, I would likely try to create an increased clearance slightly (such that the robot doesn't get stuck), while also implementing an algorithm or system that can "re-find" the line after losing it (e.g. doing a sweep).

The next issue was the robot driving off the edge (as seen in the competition). When it happened in the finals, we got it on video, allowing me to look back at it. To save time (and guarantee a point), after picking up the second pet on the way back, we threw it into the safe zone as we drove down the ramp. This would throw the robot offline, and most of the time the PID would drive it back; however, every so often, it would push the robot far enough off line that it would get stuck against the wall. I had several solutions in mind to solve this - firstly, we could adjust the throw sequence to avoid this, for example, stopping, throwing, then starting again. Another possible solution would be to add a "bumper" of sorts to the side of the bot, allowing it to still pivot even after hitting the wall. Of course, given more time, the best solution would be to adjust timings and control algorithms to properly compensate and even anticipate the throw.

## Final Thoughts
This was a fantastic experience - fun, educational, challenging, and rewarding. Alongside that, I had the pleasure of working with the best team there is:

- Andrew, who did an amazing job designing a strong, compact chassis. Who was always able to design around our needs to awkward sensor placements, high chassis loads, and always had replacements ready whenever we messsed up and damaged the robot.
- Nolan, who did a perfect job designing the electrical system. Not only was every protoboard, PCB and wire extremely reliable, it was also organised insanely well despite the small space in the chassis, and he was always on hand to diagnose and fix electrical issues.
- Nathan, who created a fantastic arm system, made sure that we always remained on task and kept us on schedule throughout the length of the competition

Over the course of this competition, I learned the most about rapid prototyping, control systems and debugging. The rapid pace required in this competition meant that we always had to push to create new prototypes with new features, plus that introduced lots of bugs which tested my debugging skills. Lastly, as a fully autonomous machine, this was a significant step up from any control system I had ever designed in the past, and I got to appreciate the difficulties that come with creating a system that can correct errors, make the right decisions, and properly achieve it’s objectives!
Fun fact about our PCBs, they all had a dinosaur associated with them!

![Dinosaurs on PCBs!](/project_markdown_text/robot-summer/dino-pcb.jpg)
Arm servo board - Spinosaurus  
Comparator board - Albertosaurus  
Reflectance sensor board - Triceratops  

## Other resources
[GITHUB Repo](https://github.com/evanlicanada/Robot-Summer-Team-7)