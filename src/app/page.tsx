import React from 'react'
import ProjectCard from '../components/ProjectCard'

const page = () => {
  return (
    <div>
      <h1 className='text-3xl font-bold text-center mb-10'>Explore Projects</h1>
      <div className='flex flex-wrap gap-6 justify-center'>
        <ProjectCard
          id="1"
          index={1}
          title="AI-Powered Chatbot"
          desc="A chatbot that uses natural language processing to provide intelligent responses."
          owner="Alice"
          techStack={["Python", "TensorFlow", "NLP"] } status='open'
        />
        <ProjectCard
          id="2"
          index={2}
          title="E-commerce Website"
          desc="A full-featured e-commerce platform with user authentication and payment integration."
          owner="Bob"
          techStack={["React", "Node.js", "MongoDB"]} status='closed'
        />
        <ProjectCard
          id="3"
          index={3}
          title="Mobile Fitness App"
          desc="An app that tracks workouts, nutrition, and provides personalized fitness plans."
          owner="Charlie"
          techStack={["Flutter", "Firebase", "Health APIs"]} status='open'
        />
      </div>
    </div>
  )
}

export default page
