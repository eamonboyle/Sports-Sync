"use client";

import { FC, useEffect, useState } from "react";
import WorkoutModal from "./ui/AddWorkoutModal";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlCalender } from "react-icons/sl";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { WorkoutDrawer } from "./WorkoutDrawer";
import { Calendar } from "@/components/ui/calendar";
import AddWorkoutToCalenderModal from "./ui/AddWorkoutToCalenderModal";
import { BsFillTrophyFill } from "react-icons/bs";
import { IoAddOutline } from "react-icons/io5";
import { exercise } from "@/app/types";



interface WorkoutProps {
  workouts: any;
  workoutRecord: any;
}

const Workout: FC<WorkoutProps> = ({ workouts, workoutRecord }) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);
  const [date, setDate] = useState<any>(new Date());
  const [filteredWorkouts, setFilteredWorkouts] = useState<exercise[]>([]);
  const [edidtedExerciseName, setEditedExerciseName] = useState("");
  const [editedExerciseWeight, setEditedExerciseWeight] = useState();
  const [editedExerciseSets, setEditedExerciseSets] = useState();
  const [editedExerciseReps, setEditedExerciseReps] = useState();
  const [selectedExercise, setSelectedExercise] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [allWorkouts, setAllWorkouts] = useState<exercise[]>(workouts);
  
  const [formattedDate, setFormattedDate] = useState(
    format(date!, "yyyy-MM-dd")
  );

  const [workout, setWorkout] = useState("");

  const { theme } = useTheme();
  

  const handleCallbackExercises = ({ title, weight, reps, sets, isPersonalRecord}: exercise) => {
    setFilteredWorkouts([...filteredWorkouts, { title, weight, reps, sets, isPersonalRecord}]);
    setWorkout(
      workout +
        `\n\n - ${title}    \n         ${weight} lbs | ${sets} sets | ${reps} reps`
    );
  };

  const handleEdit = (exerciseData: any) => {
    setSelectedExercise(true);
    setEditedExerciseName(exerciseData.title);
    setEditedExerciseReps(exerciseData.reps);
    setEditedExerciseSets(exerciseData.sets);
    setEditedExerciseWeight(exerciseData.weight);
    setIsOpen(true);
  };

  const updateWorkoutInState = (updatedWorkout: exercise) => {
    setAllWorkouts((prevWorkout: any) => {
      return prevWorkout.map((workout: any) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      );
    });
  };

  useEffect(() => {
    const workoutsForSelectedDate = allWorkouts.filter(
      (workout: any) => {
        return format(new Date(workout.date), "PPP") === format(date, "PPP")

      }
    );
    const workoutsToNotes = workoutsForSelectedDate
      .map((workout) => {
        return `- ${workout.title}    \n         ${workout.weight} lbs | ${workout.sets} sets | ${workout.reps} reps`;
      })
      .join(`\n\n`);

    setWorkout(workoutsToNotes);
    setFilteredWorkouts(workoutsForSelectedDate);
  }, [date, allWorkouts]);

  return (
    <div className="flex flex-col py-0 md:py-7 px-5 h-[100vh]">

      <div className="">
        <AddWorkoutToCalenderModal
          isOpen={isSecondOpen}
          onClose={() => setIsSecondOpen(false)}
          workout={workout}
          date={date}
          formattedDate={formattedDate}
        />
        <WorkoutModal
          date={date}
          handleCallbackExercises={handleCallbackExercises}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          editedName={edidtedExerciseName}
          editedReps={editedExerciseReps}
          editedSets={editedExerciseSets}
          editedWeight={editedExerciseWeight}
          selectedExercise={selectedExercise}
          setEditedExerciseWeight={setEditedExerciseWeight}
          setEditedExerciseSets={setEditedExerciseSets}
          setEditedExerciseReps={setEditedExerciseReps}
          workoutId={selectedExerciseId}
          updateWorkoutInState={updateWorkoutInState}
          workoutRecord={workoutRecord}
        />
        {/* HEADER */}
        <header className="flex justify-between max-w-[670px] py-5 mx-auto">
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="rounded-md">
                  <SlCalender size={20} className="" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <h1
              className={clsx(
                "text-lg font-semibold py-1 md:py-3",
                theme === "light" && "text-gray-800"
              )}
            >
              {date.toString().split(" ")[0] + ", " + date.toString().split(" ")[1] + " " + date.toString().split(" ")[2]}
            </h1>
          </div>
          <div className="">
            <Button
              variant={"default"}
              className={"text-[11px] md:text-[13px] py-2 md:hidden"}
              onClick={() => {
                setSelectedExercise(false);
                setIsOpen(true);
              }}
            >
              <IoAddOutline className="" color="white" size={30} />
            </Button>
            <Button
              variant={"default"}
              className={"hidden md:block text-[11px] md:text-[13px] py-2 rounded-md"}
              onClick={() => {
                setSelectedExercise(false);
                setIsOpen(true);
              }}
            >
              Add Workout
            </Button>
          </div>
        </header>
        {/* BODY */}
        <main className="mx-auto flex justify-center pr-7 md:pr-16 h-[80vh] py-5 sm:py-2">
          {filteredWorkouts.length == 0 ? (
            <p className="text-2xl text-gray-300 py-[270px] pl-10 pr-3 md:pr-14">
              Workout log empty
            </p>
          ) : ( 
            <div className="flex flex-col md:pl-16">
              <ul className="overflow-y-auto flex flex-col gap-3 sm:gap-1 sm:border-b-[2px] border-b-black ">
                {filteredWorkouts.length > 0 &&
                  filteredWorkouts.map((exerciseData: any) => (
                    <li
                      className="p-3 text-lg flex flex-col gap-4 rounded-sm border-[1px] border-gray-500 w-[340px] md:w-[600px] ml-8 sm:ml-0 relative"
                      onClick={() => {    
                        setSelectedExerciseId(exerciseData.id);
                   }}
                    >
                      <div className="flex justify-between relative top-0">
                        <div>
                        <div className="flex flex-row absolute gap-6">
                          <div>
                          <h3 className="font-semibold text-lg">
                            {exerciseData.title} 
                          </h3>
                          </div>

                          <div>{(exerciseData.isPersonalRecord && exerciseData.weight > 0) ? <BsFillTrophyFill className="mb-4" size={29} color="lightblue" /> : ""}</div>
                        </div>
                        </div>
                        <div className="flex flex-col py-0 my-0 top-0">
                          <div
                           className="pr-1">
                            <WorkoutDrawer
                              workouts={workouts}
                              exerciseName={exerciseData.title}
                              onEdit={() => handleEdit(exerciseData)}
                              workoutId={selectedExerciseId}
                            />
                          </div>
                          {/* <div
                            className={
                              exerciseData.isPersonalRecord ? "absolute" : "opacity-0 absolute"
                            }
                          >
                            <AiOutlineTrophy className="my-12 ml-3" size={35} color="blue" />
                          </div> */}
                        </div>
                      </div>
                      <div className="flex">
                        <dl className="flex gap-3">
                          <dt className="font-semibold m-auto text-[16px]">
                            Weight
                          </dt>
                          <dd className="text-sm m-auto">
                            {exerciseData.weight} lbs
                          </dd>
                          <dt className="font-semibold m-auto text-[16px]">
                            Sets
                          </dt>
                          <dd className="text-sm m-auto">
                            {exerciseData.sets}
                          </dd>
                          <dt className="font-semibold m-auto text-[16px]">
                            Reps
                          </dt>
                          <dd className="text-sm m-auto">
                            {exerciseData.reps}
                          </dd>
                        </dl>
                      </div>
                    </li>
                  ))}
              </ul>
              <p
                onClick={() => {
                  setIsSecondOpen(true);
                }}
                className="underline text-center py-3 cursor-pointer"
              >
                Add todays workout to your calender?
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Workout;
