import { spendUTXOAction, spendWalletAction, controlProgramAction, controlAddressAction, listUTXO } from '../../bytom'

export function FixedLimitDeposit(amount, address) {

  const depositProgram = "203f98494c8fcce82a1da8054cda521295333a6c7a6ea3b861a27fd766a5cea5731600140014f19df269f9334bdcb496da6b63b275d494470164015001500500c817a8040500e40b540220bbc81814b304cf4e129582b094672b917d28e1109aab4569697d72f102af07c84d4302597a64370200005479cda069c35b790400e1f5059600a05c797ba19a53795579a19a695a790400e1f5059653790400e1f505967800a07800a09a6955797b957c9600a069c35b797c9f9161645b010000005b79c2547951005e79895d79895c79895b7989597989587989537a894ca4587a64980000005479cd9f6959790400e1f5059653790400e1f505967800a07800a09a5c7956799f9a6955797b957c967600a069c3787c9f91616481000000005b795479515b79c1695178c2515d79c16952c3527994c251005d79895c79895b79895a79895979895879895779895679890274787e008901c07ec1696393000000005b795479515b79c16951c3c2515d79c16963a4000000557acd9f69577a577aae7cac890274787e008901c07ec169515b79c2515d79c16952c35c7994c251005d79895c79895b79895a79895979895879895779895679895579890274787e008901c07ec1696332020000005b79c2547951005e79895d79895c79895b7989597989587989537a894ca4587a64980000005479cd9f6959790400e1f5059653790400e1f505967800a07800a09a5c7956799f9a6955797b957c967600a069c3787c9f91616481000000005b795479515b79c1695178c2515d79c16952c3527994c251005d79895c79895b79895a79895979895879895779895679890274787e008901c07ec1696393000000005b795479515b79c16951c3c2515d79c16963a4000000557acd9f69577a577aae7cac890274787e008901c07ec16951c3c2515d79c1696343020000547acd9f69587a587aae7cac747800c0"
  const profitProgram = "203f98494c8fcce82a1da8054cda521295333a6c7a6ea3b861a27fd766a5cea5731600140014f19df269f9334bdcb496da6b63b275d49447016401500500c817a8040500e40b540220df4638860378a2203466833c935efa19f513ac3aae2cb52d36cee7fa5010b0794ca4587a64980000005479cd9f6959790400e1f5059653790400e1f505967800a07800a09a5c7956799f9a6955797b957c967600a069c3787c9f91616481000000005b795479515b79c1695178c2515d79c16952c3527994c251005d79895c79895b79895a79895979895879895779895679890274787e008901c07ec1696393000000005b795479515b79c16951c3c2515d79c16963a4000000557acd9f69577a577aae7cac747800c0"

  listUTXO({
    "filter": {
      "script": depositProgram,
      "asset":"df4638860378a2203466833c935efa19f513ac3aae2cb52d36cee7fa5010b079"
    }
  }).then(resp => {
    const billAmount = resp.amount
    const billAsset = resp.asset
    const utxo = resp.hash


    const gas = 40000000
    const assetDeposited = "bbc81814b304cf4e129582b094672b917d28e1109aab4569697d72f102af07c8"
    const btm = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

    const input = []
    const output = []

    input.push(spendUTXOAction(utxo, amount, address))
    input.push(spendWalletAction(amount, assetDeposited))
    input.push(spendWalletAction(gas, btm))

    if(amount < billAmount){
      output.push(controlProgramAction(amount, assetDeposited, profitProgram))
      output.push(controlAddressAction(amount, billAsset, address))
      output.push(controlProgramAction((billAmount-amount), billAsset, depositProgram))
    }else{
      output.push(controlProgramAction(amount, assetDeposited, profitProgram))
      output.push(controlAddressAction(billAmount, billAsset, address))
    }

    window.bytom.advancedTransfer(input, output)
  })
}