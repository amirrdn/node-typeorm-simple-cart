export const successResponse = (message: string, data?: any) => {
    return {
        status: true,
        message,
        data
    };
};

export const errorResponse = (message: string, error?: any) => {
    return {
        status: false,
        message,
        error
    };
}; 