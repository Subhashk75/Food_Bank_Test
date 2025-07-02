#include<bits/stdc++.h>
using namespace std;

int main(){
    int t;
    cin>>t;
    while (t--)
    {
       int n ,k;
       cin>>n>>k;
       int ans =0;
       while (n!=0)
       {   int base =1;
           while(n>=base){
               base =base * k;
           }
          base = base /k;
           n = n - base;
           ans++;
       }
       
       cout<<ans<<endl;
    }
    
}