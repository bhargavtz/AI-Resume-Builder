import axios from "axios";
import { UpdateResumeRequest, CreateResumeRequest, Resume } from "@/lib/types";

const UpdateResumeDetail = (id: string, data: UpdateResumeRequest) =>
    axios.put<Resume>('/api/resumes/' + id, data);

const GetResumeById = (id: string) =>
    axios.get<Resume>('/api/resumes/' + id);

const CreateNewResume = (data: CreateResumeRequest) =>
    axios.post<Resume>('/api/resumes', data);

export default {
    UpdateResumeDetail,
    GetResumeById,
    CreateNewResume
}
