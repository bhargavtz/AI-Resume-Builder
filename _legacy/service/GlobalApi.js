import axios from "axios";


const axiosClient=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    headers:{
        'Content-Type':'application/json'
    }
})


const CreateNewResume=(data)=>axiosClient.post('/resumes',data);

const GetUserResumes=()=>axiosClient.get('/resumes'); // Simplified for now, will fetch all resumes

const UpdateResumeDetail=(id,data)=>axiosClient.put('/resumes/'+id,data)

const GetResumeById=(id)=>axiosClient.get('/resumes/'+id)

const DeleteResumeById=(id)=>axiosClient.delete('/resumes/'+id)

export default{
    CreateNewResume,
    GetUserResumes,
    UpdateResumeDetail,
    GetResumeById,
    DeleteResumeById
}
