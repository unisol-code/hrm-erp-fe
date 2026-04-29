import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import { toastState } from "../../../state/toastState";
import useFetch from "../../useFetch";
import { useNavigate } from "react-router-dom";
import { cityLocationAtom, countryLocationAtom, stateLocationAtom } from "../../../state/onBoarding/empLocationState";

const useEmpLocation = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState("");
    const [countryLocation, setCountryLocation] = useRecoilState(countryLocationAtom);
    const [stateLocation, setStateLocation] = useRecoilState(stateLocationAtom);
    const [cityLocation, setCityLocation] = useRecoilState(cityLocationAtom);

    const fetchCountryLocation = async () => {
        setLoading(true);
        try {
            fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}employees/getCountries`,
            }).then((res) => {
                if (res) {
                    setCountryLocation(res?.data);
                }
            });
        } catch (error) {
            // eslint-disable-next-line no-console getCities?stateCode=MH
            console.error("Error updating:", error);
            setLoading(false);
        }
    }

    const fetchStateLocation = async (countryCode) => {
        setLoading(true);
        try {
            fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}employees/getStates?country=${countryCode}`,
            }).then((res) => {
                if (res?.success) {
                    setStateLocation(res?.data);
                }
            });
        } catch (error) {
            // eslint-disable-next-line no-console getCities?stateCode=MH
            console.error("Error updating:", error);
            setLoading(false);
        }
    }

    const fetchCityLocation = async (countryCode, stateCode) => {
        setLoading(true);
        try {
            fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}employees/getCities?stateCode=${stateCode}&country=${countryCode}`,
            }).then((res) => {
                if (res?.success) {
                    setCityLocation(res?.data);
                }
            });
        } catch (error) {
            // eslint-disable-next-line no-console getCities?stateCode=MH
            console.error("Error updating:", error);
            setLoading(false);
        }
    };

    return {
        stateLocation, loading, errors, fetchCountryLocation, countryLocation,
        fetchCityLocation, fetchStateLocation,
        cityLocation
    }
}

export default useEmpLocation