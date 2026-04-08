/*function reverse(str){
return str.split('').reverse().join('')
}
console.log(reverse("Meet"));
console.log(reverse("Hello"));*/

/*function isevenodd(number){

        if (number % 2 ==0){
        return "even"
        }
        else {
        return "odd"
        }
    
    }
console.log(isevenodd(1))
console.log(isevenodd(2))
console.log(isevenodd(3))
console.log(isevenodd(4))
*/

/*function findMax(arr){

    
    return Math.max(...arr)
}
console.log(findMax([1,2,3]))
console.log(findMax([1000,200,30]))*/

/*function countvowel(str){
    const vowel= 'aeiou'
return str.split('').filter(letter => 'aeiou'.includes(letter) ).length

}
console.log(countvowel("meet"))*/
/*function fizzbuzz(n){
    for (let i=1; i<=n; i++){
        if (i % 3 === 0 && i % 5 === 0){    
            console.log("FizzBuzz")
        }
        else if (i % 3 === 0){
            console.log("Fizz")
        }
        else if (i % 5 === 0){
            console.log("Buzz")
        }
        else {
            console.log(i)
        }
    }
}

fizzbuzz(15)*/
/*function arrsum(arr){

    return arr.reduce((total,num) => total + num ,0 )


}
console.log(arrsum([1,2,3,4,5]))*/
function findDuplicates(arr) {
    return arr.filter((item, index) => 
        arr.indexOf(item) !== index
    )
}
console.log(findDuplicates([1,1,2,3,4,4,5,5]))