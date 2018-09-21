module.exports = client => {

    let string = '';
    client.guilds.forEach(guild=>{
        string+= 'Guild name: ' + guild.name + ' - ' + guild.owner.user.tag + '\n ';
    })
    console.log(string)

    client.user.setActivity("---help for commands!")

    console.log("Client Initiallized!")


}

