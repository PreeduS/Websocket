import emailService from 'app/services/email';

// todo - remove
class Dev {
    sendPasswordResetMail = async (req, res) => {
        // todo - get email
        return res.send('null')
        /*try{
            // email
            await emailService.sendPasswordResetMail('testapp.noreplay@gmail.com')
            return res.send('sendPasswordResetMail')

        }catch(error){
            console.log(error)
            return res.send('sendPasswordResetMail err')

        }*/

    }


}

export default new Dev()