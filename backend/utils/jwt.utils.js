import jsonwebtoken from 'jsonwebtoken'

export const generateAccessToken = async (userId, res) => {
    const token = jsonwebtoken.sign({userId}, process.env.JSON_SECRET_KEY, {
        expiresIn: "4d"
    })

    res.cookie("jwt", token, {
        maxAge: (4 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "strict",
    })

    return token;
}