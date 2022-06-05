import (
  sdk "github.com/pokt-network/pocket-core/types"
)

type StdTx struct {
	Msg       sdk.Msg      `json:"msg" yaml:"msg"`
	Fee       sdk.Coins    `json:"fee" yaml:"fee"`
	Signature StdSignature `json:"signature" yaml:"signature"`
	Memo      string       `json:"memo" yaml:"memo"`
	Entropy   int64        `json:"entropy" yaml:"entropy"`
}

// DefaultTxDecoder logic for standard transaction decoding
func DefaultTxDecoder(cdc *codec.Codec) sdk.TxDecoder {
	return func(txBytes []byte, blockHeight int64) (sdk.Tx, sdk.Error) {
		var tx = StdTx{}
		if len(txBytes) == 0 {
			return nil, sdk.ErrTxDecode("txBytes are empty")
		}
		// ProtoStdTx.ProtoMsg is an interface. The concrete types
		// are registered by MakeTxCodec
		err := cdc.UnmarshalBinaryLengthPrefixed(txBytes, &tx, blockHeight)
		if err != nil {
			return nil, sdk.ErrTxDecode("error decoding transaction: " + err.Error()).TraceSDK(err.Error())
		}
		return tx, nil
	}
}
