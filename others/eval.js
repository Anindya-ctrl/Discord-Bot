function evaluate(message) {
    const { author, channel, content } = message;
    if(author.id !== '702144210354045078') return ;

    let result ;

    try {
        result = eval(content.split(/[ ]+/).slice(1).join(''))
    } catch(err) {
        if(err instanceof EvalError) {
            result = err.message;
        }
    }

    channel.send(result || 'An error occured.').catch(err => console.error(err));
}

module.exports = evaluate;
