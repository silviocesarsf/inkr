import bcrypt from "bcrypt";
import { format, toZonedTime } from "date-fns-tz";
export const hashPassword = async (password: string): Promise<string> => {
    const salt = 10;
    return await bcrypt.hash(password, salt);
}

export const formatDateToISO = (date: Date | string) => {
    return format(toZonedTime(date, "America/Sao_Paulo"), "yyyy-MM-dd HH:mm:ss", {
        timeZone: "America/Sao_Paulo"
    }) || ""
}