import { useState } from "react";
import conf from "../../../config";
import { useRecoilState } from "recoil";
import useFetch from "../../useFetch";
import { statusOptionsAtom } from "../../../state/dropdown/dropdownState";

const useDropdown = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [statusOptions, setStatusOptions] = useRecoilState(statusOptionsAtom);

    const fetchStatusOptions = async (role) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (role) {
                params.append("role", role);
            }
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}dropdown/getDropdownForStatus?${params.toString()}`,
            });
            if (res) {
                setStatusOptions(res?.data);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching status options", err);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return { loading, statusOptions, fetchStatusOptions };
}

export default useDropdown